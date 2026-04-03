export {};

type HealthCheckResult = {
  name: string;
  ok: boolean;
  details: string;
};

const baseURL = process.env.SMOKE_BASE_URL || 'http://localhost:3000';
const timeoutMs = Number.parseInt(process.env.ADMIN_HEALTH_TIMEOUT_MS || '10000', 10);

async function checkRoute(name: string, path: string): Promise<HealthCheckResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const start = Date.now();

  try {
    const response = await fetch(new URL(path, baseURL), {
      cache: 'no-store',
      redirect: 'manual',
      signal: controller.signal,
    });

    const durationMs = Date.now() - start;
    const ok = response.status === 200;

    return {
      name,
      ok,
      details: `status=${response.status} duration_ms=${durationMs}`,
    };
  } catch (error) {
    const durationMs = Date.now() - start;
    return {
      name,
      ok: false,
      details: `duration_ms=${durationMs} error=${(error as Error).message}`,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function main(): Promise<void> {
  const checks = await Promise.all([
    checkRoute('admin dashboard', '/admin'),
    checkRoute('homepage global editor', '/admin/globals/homepage'),
  ]);

  for (const check of checks) {
    const icon = check.ok ? 'PASS' : 'FAIL';
    console.log(`[admin-health] ${icon} ${check.name} (${check.details})`);
  }

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    throw new Error(`Admin health failed (${failed.length} checks)`);
  }

  console.log('[admin-health] all checks passed');
}

main().catch((error) => {
  console.error('[admin-health] failed', error);
  process.exit(1);
});
