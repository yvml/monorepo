import { randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { config } from 'dotenv';
import { Pool } from 'pg';
import { createAuth, DEFAULT_MIN_PASSWORD_LENGTH } from './server';

config({ quiet: true });

/**
 * Reads a line from the terminal without echoing it.
 *
 * @param prompt - the text shown before the cursor.
 * @returns what was typed.
 * @throws when input is not a terminal or the user presses Ctrl+C.
 */
function readHidden(prompt: string): Promise<string> {
  const { stdin, stdout } = process;
  if (!stdin.isTTY) throw new Error('Run this from a terminal so the password can be typed hidden');
  return new Promise((resolve, reject) => {
    let value = '';
    stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    const onData = (chunk: string) => {
      for (const char of chunk) {
        if (char === '\u0003') {
          cleanup();
          reject(new Error('Cancelled'));
          return;
        }
        if (char === '\r' || char === '\n') {
          cleanup();
          stdout.write('\n');
          resolve(value);
          return;
        }
        if (char === '\u007f' || char === '\b') value = value.slice(0, -1);
        else value += char;
      }
    };
    const cleanup = () => {
      stdin.off('data', onData);
      stdin.setRawMode(false);
      stdin.pause();
    };
    stdin.on('data', onData);
  });
}

/** Minimum password length; `MIN_PASSWORD_LENGTH` in the environment, matching the app's auth configuration. */
const MIN_PASSWORD_LENGTH = Number(process.env.MIN_PASSWORD_LENGTH ?? DEFAULT_MIN_PASSWORD_LENGTH);

/** Local Supabase connection string, used unless `LOCAL_DATABASE_URL` is set. */
const DEFAULT_LOCAL_URL = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

/** Prefix of the auth tables; `AUTH_TABLE_PREFIX` in the environment, matching the app's auth configuration. */
const PREFIX = process.env.AUTH_TABLE_PREFIX ?? 'auth_';

/** The tables copied to the hosted database for one user, in dependency order, with the condition that selects the user's rows. */
const COPIED_TABLES = [
  { table: `${PREFIX}users`, where: 'email = $1' },
  {
    table: `${PREFIX}accounts`,
    where: `user_id in (select id from ${PREFIX}users where email = $1)`,
  },
] as const;

/**
 * Reads a visible line from the terminal.
 *
 * @param question - the text shown before the cursor.
 * @returns the trimmed answer.
 */
async function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
}

/**
 * Asks for a password twice, hidden, until the two match and meet the minimum length.
 *
 * @returns the confirmed password.
 */
async function askPassword(): Promise<string> {
  for (;;) {
    const password = await readHidden(`Password (${MIN_PASSWORD_LENGTH}+ characters): `);
    if (password.length < MIN_PASSWORD_LENGTH) {
      console.log(`Too short: needs at least ${MIN_PASSWORD_LENGTH} characters. Try again.`);
      continue;
    }
    const again = await readHidden('Repeat password: ');
    if (password !== again) {
      console.log('The passwords do not match. Try again.');
      continue;
    }
    return password;
  }
}

/**
 * Returns the hosted connection string from `HOSTED_DATABASE_URL` or `HOSTED_DB`, with `uselibpqcompat=true`
 * added so the `pg` driver accepts Supabase's certificate chain.
 *
 * @returns the connection string, or `null` when neither variable is set.
 */
function hostedUrl(): string | null {
  const hosted = process.env.HOSTED_DATABASE_URL ?? process.env.HOSTED_DB;
  if (!hosted) return null;
  if (hosted.includes('uselibpqcompat')) return hosted;
  return `${hosted}${hosted.includes('?') ? '&' : '?'}uselibpqcompat=true`;
}

/**
 * Copies one user's user and account rows (including the password hash) from the local database to the
 * hosted one, in a single transaction. Sessions are not copied. Does nothing when the hosted database already
 * has an account with that email.
 *
 * @param localUrl - the local connection string.
 * @param hostedConnection - the hosted connection string.
 * @param email - the user's email.
 * @returns `true` when rows were copied, `false` when the user already existed on the hosted database.
 */
async function copyToHosted(
  localUrl: string,
  hostedConnection: string,
  email: string
): Promise<boolean> {
  const local = new Pool({ connectionString: localUrl, max: 1 });
  const hosted = new Pool({ connectionString: hostedConnection, max: 1 });
  try {
    const existing = await hosted.query(`select 1 from ${PREFIX}users where email = $1`, [email]);
    if (existing.rowCount) return false;
    const client = await hosted.connect();
    try {
      await client.query('begin');
      for (const { table, where } of COPIED_TABLES) {
        const { rows } = await local.query(`select * from ${table} where ${where}`, [email]);
        for (const row of rows) {
          const columns = Object.keys(row);
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
          const names = columns.map((c) => `"${c}"`).join(', ');
          await client.query(
            `insert into ${table} (${names}) values (${placeholders})`,
            columns.map((c) => row[c])
          );
        }
      }
      await client.query('commit');
      return true;
    } catch (err) {
      await client.query('rollback');
      throw err;
    } finally {
      client.release();
    }
  } finally {
    await local.end();
    await hosted.end();
  }
}

/**
 * Whether a user with this email exists.
 *
 * @param url - the connection string.
 * @param email - the email.
 * @returns `true` when there is one.
 */
async function userExists(url: string, email: string): Promise<boolean> {
  const pool = new Pool({ connectionString: url, max: 1 });
  try {
    const { rowCount } = await pool.query(`select 1 from ${PREFIX}users where email = $1`, [email]);
    return Boolean(rowCount);
  } finally {
    await pool.end();
  }
}

/**
 * Replaces the password hash of one user's credential account. Sessions are left alone.
 *
 * @param url - the connection string.
 * @param email - the user's email.
 * @param hash - the new password hash.
 * @returns `true` when an account was updated, `false` when the user has no credential account there.
 */
async function setPassword(url: string, email: string, hash: string): Promise<boolean> {
  const pool = new Pool({ connectionString: url, max: 1 });
  try {
    const result = await pool.query(
      `update ${PREFIX}accounts set password = $1, updated_at = now()
        where provider_id = 'credential' and user_id in (select id from ${PREFIX}users where email = $2)`,
      [hash, email]
    );
    return Boolean(result.rowCount);
  } finally {
    await pool.end();
  }
}

/**
 * Marks a user's email as verified. Better Auth only lets GitHub sign in to an existing user whose email is verified,
 * and the administrator who runs this script is the one vouching that the email is the person's.
 *
 * @param url - the connection string.
 * @param email - the user's email.
 * @returns `true` when a user was updated, `false` when there is no such user there.
 */
async function markVerified(url: string, email: string): Promise<boolean> {
  const pool = new Pool({ connectionString: url, max: 1 });
  try {
    const result = await pool.query(
      `update ${PREFIX}users set email_verified = true, updated_at = now() where email = $1`,
      [email]
    );
    return Boolean(result.rowCount);
  } finally {
    await pool.end();
  }
}

/**
 * Interactive script that creates an email-and-password user in the local database, then copies the user
 * to the hosted database. Asks for email, name and a hidden password, so nothing sensitive reaches shell
 * history. The hosted copy needs `HOSTED_DB` (or `HOSTED_DATABASE_URL`) in the environment; without it only
 * the local account is created. Usage: `pnpm create-user`. With `--update-password` it creates nothing: it asks for
 * an email and a new password, and sets that password on the existing account in the local database and in the
 * hosted one, for someone whose password is lost. With `--verify-email` it asks for an email and marks that user's
 * email verified in both databases, which lets them sign in with GitHub.
 *
 * @returns the process exit code.
 */
async function main(): Promise<number> {
  if (!process.stdin.isTTY) throw new Error('Run this from a terminal');
  const localUrl = process.env.LOCAL_DATABASE_URL ?? DEFAULT_LOCAL_URL;
  const hosted = hostedUrl();
  if (process.argv.includes('--verify-email')) {
    const who = await ask('Email: ');
    const targets = [
      { name: 'local', url: localUrl },
      ...(hosted ? [{ name: 'hosted', url: hosted }] : []),
    ];
    let updated = false;
    for (const { name: where, url } of targets) {
      const done = await markVerified(url, who);
      console.log(
        done
          ? `Marked ${who} verified in the ${where} database`
          : `No user ${who} in the ${where} database`
      );
      updated ||= done;
    }
    if (!hosted) console.log('HOSTED_DB is not set: skipped the hosted database');
    return updated ? 0 : 1;
  }
  if (process.argv.includes('--update-password')) {
    const who = await ask('Email: ');
    const next = await askPassword();
    const { auth, close } = createAuth({
      databaseUrl: localUrl,
      secret: randomBytes(32).toString('base64'),
      baseUrl: 'http://localhost',
      cookiePrefix: 'script',
    });
    let hash: string;
    try {
      hash = await (await auth.$context).password.hash(next);
    } finally {
      await close();
    }
    const targets = [
      { name: 'local', url: localUrl },
      ...(hosted ? [{ name: 'hosted', url: hosted }] : []),
    ];
    let updated = false;
    for (const { name: where, url } of targets) {
      const done = await setPassword(url, who, hash);
      console.log(
        done
          ? `Set the password of ${who} in the ${where} database`
          : `No credential account for ${who} in the ${where} database`
      );
      updated ||= done;
    }
    if (!hosted) console.log('HOSTED_DB is not set: skipped the hosted database');
    return updated ? 0 : 1;
  }
  const email = await ask('Email: ');
  const name = await ask('Name: ');
  if (!email || !name) throw new Error('Email and name are required');
  const password = await askPassword();

  if (await userExists(localUrl, email)) {
    throw new Error(
      `${email} already exists in the local database; use --update-password to change its password`
    );
  }
  const { auth, close } = createAuth({
    databaseUrl: localUrl,
    secret: randomBytes(32).toString('base64'),
    baseUrl: 'http://localhost',
    cookiePrefix: 'script',
    allowSignUp: true,
  });
  try {
    await auth.api.signUpEmail({ body: { email, name, password } });
    await markVerified(localUrl, email);
    console.log(`Created ${email} in the local database`);
  } finally {
    await close();
  }

  if (!hosted) {
    console.log('HOSTED_DB is not set: skipped the hosted database');
    return 0;
  }
  const copied = await copyToHosted(localUrl, hosted, email);
  console.log(
    copied
      ? `Copied ${email} to the hosted database`
      : `${email} already exists on the hosted database`
  );
  return 0;
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  });
