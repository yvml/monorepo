import { describe, expect, it } from 'vitest';
import { createAuth, DEFAULT_MIN_PASSWORD_LENGTH, isAllowedEmail } from '../src/server';

const base = {
  databaseUrl: 'postgresql://user:pass@127.0.0.1:1/none',
  secret: 'x'.repeat(32),
  baseUrl: 'https://app.example.com',
  cookiePrefix: 'test',
};

/** The options Better Auth was built with. */
function optionsOf(config: Parameters<typeof createAuth>[0]) {
  const { auth, close } = createAuth(config);
  return { options: auth.options, close };
}

describe('createAuth', () => {
  it('uses the documented defaults', async () => {
    const { options, close } = optionsOf(base);
    expect(options.emailAndPassword?.minPasswordLength).toBe(DEFAULT_MIN_PASSWORD_LENGTH);
    expect(options.advanced?.ipAddress?.ipAddressHeaders).toEqual(['cf-connecting-ip']);
    expect(options.user?.modelName).toBe('auth_users');
    expect(options.session?.modelName).toBe('auth_sessions');
    expect(options.account?.modelName).toBe('auth_accounts');
    expect(options.verification?.modelName).toBe('auth_verifications');
    expect(options.emailAndPassword?.disableSignUp).toBe(true);
    expect(options.trustedOrigins).toEqual([base.baseUrl]);
    await close();
  });

  it('takes the password length, IP headers and table prefix', async () => {
    const { options, close } = optionsOf({
      ...base,
      minPasswordLength: 20,
      ipAddressHeaders: ['x-forwarded-for'],
      tablePrefix: 'acct_',
    });
    expect(options.emailAndPassword?.minPasswordLength).toBe(20);
    expect(options.advanced?.ipAddress?.ipAddressHeaders).toEqual(['x-forwarded-for']);
    expect(options.user?.modelName).toBe('acct_users');
    expect(options.verification?.modelName).toBe('acct_verifications');
    await close();
  });

  it('has no GitHub sign-in unless configured', async () => {
    const off = optionsOf(base);
    expect(off.options.socialProviders).toBeUndefined();
    expect(off.options.account?.accountLinking?.trustedProviders).toEqual([]);
    await off.close();

    const on = optionsOf({ ...base, github: { clientId: 'id', clientSecret: 'secret' } });
    expect(on.options.socialProviders?.github?.disableSignUp).toBe(true);
    expect(on.options.account?.accountLinking?.trustedProviders).toEqual(['github']);
    await on.close();
  });

  it('allows sign-up only when asked', async () => {
    const { options, close } = optionsOf({ ...base, allowSignUp: true });
    expect(options.emailAndPassword?.disableSignUp).toBe(false);
    await close();
  });

  it('makes cookies cross-site only when asked', async () => {
    const plain = optionsOf(base);
    expect(plain.options.advanced?.defaultCookieAttributes).toBeUndefined();
    await plain.close();

    const framed = optionsOf({ ...base, crossSiteCookies: true });
    expect(framed.options.advanced?.defaultCookieAttributes).toEqual({
      sameSite: 'none',
      secure: true,
      partitioned: true,
    });
    await framed.close();
  });
});

describe('Google sign-in', () => {
  const google = { clientId: 'id', clientSecret: 'secret' };

  it('is off unless configured', async () => {
    const { options, close } = optionsOf(base);
    expect(options.socialProviders?.google).toBeUndefined();
    await close();
  });

  it('only signs in existing accounts without an allow-list', async () => {
    const { options, close } = optionsOf({ ...base, google });
    expect(options.socialProviders?.google?.disableSignUp).toBe(true);
    expect(options.databaseHooks).toBeUndefined();
    await close();
  });

  it('creates accounts for allow-listed emails and restricts the hosted domain', async () => {
    const { options, close } = optionsOf({
      ...base,
      google: { ...google, allowedDomains: ['example.com'] },
    });
    expect(options.socialProviders?.google?.disableSignUp).toBe(false);
    expect(options.socialProviders?.google?.hd).toBe('example.com');
    expect(options.databaseHooks?.user?.create?.before).toBeTypeOf('function');
    await close();
  });
});

describe('isAllowedEmail', () => {
  it('matches domains and addresses case-insensitively', () => {
    const list = { allowedDomains: ['Example.com'], allowedEmails: ['guest@other.org'] };
    expect(isAllowedEmail('Ann@EXAMPLE.com', list)).toBe(true);
    expect(isAllowedEmail('guest@other.org', list)).toBe(true);
    expect(isAllowedEmail('x@other.org', list)).toBe(false);
    expect(isAllowedEmail('x@evil-example.com', list)).toBe(false);
  });
});
