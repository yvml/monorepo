import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

/** Google sign-in settings. */
export type GoogleConfig = {
  clientId: string;
  clientSecret: string;
  /** Email domains that may sign in, such as `example.com`. */
  allowedDomains?: string[];
  /** Individual emails that may sign in. */
  allowedEmails?: string[];
};

/** What `createAuth` needs to know about the app it serves. */
export type AuthConfig = {
  /** PostgreSQL connection string. On Workers, the Hyperdrive binding's connection string. */
  databaseUrl: string;
  /** Signs and encrypts cookies and tokens. At least 32 random characters; keep it a Worker secret. */
  secret: string;
  /** The app's public origin, e.g. `https://app.example.com`. It is also the only trusted origin. */
  baseUrl: string;
  /** Prefix for the auth cookies, so apps on one domain do not share them. */
  cookiePrefix: string;
  /** Allow `signUpEmail`. Only the account-creation script turns this on; an app serving HTTP never does. */
  allowSignUp?: boolean;
  /**
   * Make the cookies work when the app is shown in another site's iframe (the studio's Presentation tool):
   * `SameSite=None; Secure; Partitioned`. Requires HTTPS, so only turn it on for a deployed app.
   */
  crossSiteCookies?: boolean;
  /**
   * Let people sign in with GitHub. It only signs in an existing account whose email matches the GitHub account's
   * verified email; it never creates one. Leave it out to turn GitHub sign-in off.
   */
  github?: { clientId: string; clientSecret: string };
  /**
   * Let people sign in with Google. With `allowedDomains` or `allowedEmails`, a Google account on the list gets an
   * account made on first sign-in and everyone else is refused. With neither, it only signs in an existing account
   * whose email matches the verified Google email.
   */
  google?: GoogleConfig;
  /** Fewest characters a password may have. Defaults to `DEFAULT_MIN_PASSWORD_LENGTH`. */
  minPasswordLength?: number;
  /** Request headers that carry the client's IP address, in order of preference. Defaults to `cf-connecting-ip`. */
  ipAddressHeaders?: string[];
  /** Prefix of the four tables, e.g. `auth_` gives `auth_users`. Defaults to `auth_`. Columns are snake_case. */
  tablePrefix?: string;
};

/** Fewest characters a password may have unless `minPasswordLength` says otherwise. */
export const DEFAULT_MIN_PASSWORD_LENGTH = 12;

/**
 * Whether an email is on the allow-list. Case-insensitive; a domain matches the part after the last `@`.
 *
 * @param email - the address to check.
 * @param list - the allowed domains and emails.
 * @returns true when the email's domain or the whole address is listed.
 */
export function isAllowedEmail(
  email: string,
  list: { allowedDomains?: string[] | undefined; allowedEmails?: string[] | undefined }
) {
  const address = email.trim().toLowerCase();
  const domain = address.slice(address.lastIndexOf('@') + 1);
  const domains = (list.allowedDomains ?? []).map((item) => item.trim().toLowerCase());
  const emails = (list.allowedEmails ?? []).map((item) => item.trim().toLowerCase());
  return domains.includes(domain) || emails.includes(address);
}

/** Seven days, in seconds. */
const SESSION_LIFETIME = 60 * 60 * 24 * 7;

/** Timestamp columns every Better Auth table has, mapped to snake_case. */
const TIMESTAMPS = { createdAt: 'created_at', updatedAt: 'updated_at' } as const;

/**
 * Builds a Better Auth instance with its own PostgreSQL pool. Call it once per request on Workers, because
 * a connection cannot be shared between requests there, and call `close` when the request is done.
 *
 * Accounts are email and password with no public sign-up: someone with database access creates each account
 * with the package's `create-user` script. The tables are `<prefix>users`, `<prefix>sessions`,
 * `<prefix>accounts` and `<prefix>verifications` with snake_case columns; the app's schema must define them.
 *
 * @param config - the database, secret, origin and cookie prefix, and the optional settings.
 * @returns the auth instance and a function that closes its pool.
 */
export function createAuth(config: AuthConfig) {
  const prefix = config.tablePrefix ?? 'auth_';
  const pool = new Pool({ connectionString: config.databaseUrl, max: 1 });
  const google = config.google;
  const hasAllowList = Boolean(google?.allowedDomains?.length || google?.allowedEmails?.length);
  const onlyDomain = google?.allowedDomains?.length === 1 && !google.allowedEmails?.length;
  const auth = betterAuth({
    database: pool,
    secret: config.secret,
    baseURL: config.baseUrl,
    trustedOrigins: [config.baseUrl],
    ...((config.github || google) && {
      socialProviders: {
        ...(config.github && { github: { ...config.github, disableSignUp: true } }),
        ...(google && {
          google: {
            clientId: google.clientId,
            clientSecret: google.clientSecret,
            disableSignUp: !hasAllowList,
            ...(onlyDomain && { hd: google.allowedDomains![0]! }),
          },
        }),
      },
    }),
    ...(hasAllowList && {
      databaseHooks: {
        user: {
          create: {
            /** Refuses to create an account for an email that is not on the Google allow-list. */
            before: async (user: { email: string }) => isAllowedEmail(user.email, google!),
          },
        },
      },
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: !config.allowSignUp,
      autoSignIn: false,
      minPasswordLength: config.minPasswordLength ?? DEFAULT_MIN_PASSWORD_LENGTH,
    },
    advanced: {
      cookiePrefix: config.cookiePrefix,
      ...(config.crossSiteCookies && {
        defaultCookieAttributes: { sameSite: 'none', secure: true, partitioned: true },
      }),
      ipAddress: { ipAddressHeaders: config.ipAddressHeaders ?? ['cf-connecting-ip'] },
    },
    user: {
      modelName: `${prefix}users`,
      fields: { emailVerified: 'email_verified', ...TIMESTAMPS },
    },
    session: {
      modelName: `${prefix}sessions`,
      expiresIn: SESSION_LIFETIME,
      fields: {
        userId: 'user_id',
        expiresAt: 'expires_at',
        ipAddress: 'ip_address',
        userAgent: 'user_agent',
        ...TIMESTAMPS,
      },
    },
    account: {
      modelName: `${prefix}accounts`,
      accountLinking: { enabled: true, trustedProviders: [...(config.github ? ['github'] : []), ...(google ? ['google'] : [])] },
      fields: {
        userId: 'user_id',
        accountId: 'account_id',
        providerId: 'provider_id',
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        idToken: 'id_token',
        accessTokenExpiresAt: 'access_token_expires_at',
        refreshTokenExpiresAt: 'refresh_token_expires_at',
        ...TIMESTAMPS,
      },
    },
    verification: {
      modelName: `${prefix}verifications`,
      fields: { expiresAt: 'expires_at', ...TIMESTAMPS },
    },
  });
  return { auth, close: () => pool.end() };
}

/** A Better Auth instance made by `createAuth`. */
export type Auth = ReturnType<typeof createAuth>['auth'];
