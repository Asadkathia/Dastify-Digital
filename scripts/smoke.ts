type CheckResult = {
  name: string;
  ok: boolean;
  details: string;
};

const baseURL = process.env.SMOKE_BASE_URL || 'http://localhost:3000';

function getCookieHeader(headers: Headers): string {
  const withGetSetCookie = headers as Headers & { getSetCookie?: () => string[] };
  const setCookies = withGetSetCookie.getSetCookie?.() || [];
  if (setCookies.length > 0) {
    return setCookies.map((cookie) => cookie.split(';')[0]).join('; ');
  }

  const single = headers.get('set-cookie');
  if (!single) {
    return '';
  }

  return single.split(',').map((cookie) => cookie.split(';')[0]).join('; ');
}

async function checkRoute(name: string, path: string, expected: (status: number) => boolean): Promise<CheckResult> {
  try {
    const response = await fetch(new URL(path, baseURL), {
      redirect: 'manual',
      cache: 'no-store',
    });

    const ok = expected(response.status);
    return {
      name,
      ok,
      details: `status=${response.status}`,
    };
  } catch (error) {
    return {
      name,
      ok: false,
      details: `error=${(error as Error).message}`,
    };
  }
}

async function checkPreviewFlow(): Promise<CheckResult> {
  try {
    const enter = await fetch(new URL('/api/preview?slug=/', baseURL), {
      redirect: 'manual',
      cache: 'no-store',
    });

    const enterLocation = enter.headers.get('location') || '';
    const setCookie = enter.headers.get('set-cookie') || '';
    const enterOk = enter.status >= 300 && enter.status < 400 && enterLocation.length > 0;
    const hasDraftCookie = setCookie.includes('__prerender_bypass') || setCookie.includes('__next_preview_data');

    const exit = await fetch(new URL('/api/exit-preview?slug=/', baseURL), {
      redirect: 'manual',
      cache: 'no-store',
    });

    const exitLocation = exit.headers.get('location') || '';
    const exitOk = exit.status >= 300 && exit.status < 400 && exitLocation.length > 0;

    const ok = enterOk && hasDraftCookie && exitOk;

    return {
      name: 'preview enter/exit',
      ok,
      details: `enter=${enter.status} cookie=${hasDraftCookie} exit=${exit.status}`,
    };
  } catch (error) {
    return {
      name: 'preview enter/exit',
      ok: false,
      details: `error=${(error as Error).message}`,
    };
  }
}

async function checkGlobalSave(): Promise<CheckResult> {
  const email = process.env.SMOKE_ADMIN_EMAIL;
  const password = process.env.SMOKE_ADMIN_PASSWORD;

  if (!email || !password) {
    return {
      name: 'global save',
      ok: true,
      details: 'skipped (set SMOKE_ADMIN_EMAIL and SMOKE_ADMIN_PASSWORD to enable)',
    };
  }

  try {
    const login = await fetch(new URL('/api/users/login', baseURL), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (login.status !== 200) {
      return {
        name: 'global save',
        ok: false,
        details: `login failed status=${login.status}`,
      };
    }

    const cookieHeader = getCookieHeader(login.headers);
    if (!cookieHeader) {
      return {
        name: 'global save',
        ok: false,
        details: 'login succeeded but auth cookie missing',
      };
    }

    const currentRes = await fetch(new URL('/api/globals/homepage?depth=0&draft=true', baseURL), {
      headers: {
        cookie: cookieHeader,
      },
    });

    if (currentRes.status !== 200) {
      return {
        name: 'global save',
        ok: false,
        details: `failed to read homepage draft status=${currentRes.status}`,
      };
    }

    const current = (await currentRes.json()) as Record<string, unknown>;
    const hero = (current.hero ?? {}) as Record<string, unknown>;
    const chip = typeof hero.chip === 'string' ? hero.chip : 'AI-Powered Healthcare Marketing';

    const saveRes = await fetch(new URL('/api/globals/homepage?depth=0&draft=true', baseURL), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        hero: {
          chip,
        },
      }),
    });

    return {
      name: 'global save',
      ok: saveRes.status === 200,
      details: `status=${saveRes.status}`,
    };
  } catch (error) {
    return {
      name: 'global save',
      ok: false,
      details: `error=${(error as Error).message}`,
    };
  }
}

async function main() {
  const checks: CheckResult[] = [];

  checks.push(await checkRoute('site /', '/', (status) => status === 200));
  checks.push(await checkRoute('admin /admin', '/admin', (status) => status === 200));
  checks.push(await checkPreviewFlow());
  checks.push(await checkGlobalSave());

  for (const check of checks) {
    const icon = check.ok ? 'PASS' : 'FAIL';
    console.log(`[smoke] ${icon} ${check.name} (${check.details})`);
  }

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    throw new Error(`Smoke test failed (${failed.length} checks)`);
  }

  console.log('[smoke] all checks passed');
}

main().catch((error) => {
  console.error('[smoke] failed', error);
  process.exit(1);
});
