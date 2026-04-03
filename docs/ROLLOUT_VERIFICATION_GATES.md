# Rollout Verification Gates

This document defines the release gates for local and pre-release verification.

## Gate Stages

### `local` gate
Runs deterministic checks that do not require an active web server:

1. `npm run db:migrate`
2. `npm run db:verify`
3. `npm run seed:cms-baseline`
4. `npm run build`

Command:

```bash
npm run gate:local
```

### `runtime` gate
Runs runtime checks against a live server:

1. `npm run health:admin`
2. `npm run smoke`

Requirements:
- Dev or preview server is running.
- Default target is `http://localhost:3000` (override with `SMOKE_BASE_URL`).

Optional authenticated save check:
- Set `SMOKE_ADMIN_EMAIL` and `SMOKE_ADMIN_PASSWORD`.

Command:

```bash
npm run gate:runtime
```

### `full` gate
Runs `local` then `runtime` in sequence.

Command:

```bash
npm run gate:full
```

## Minimum Promotion Policy

Use these rules before promoting changes:

1. Code/schema changes: `gate:local` must pass.
2. User-facing release candidate: `gate:runtime` must pass against target environment.
3. Final signoff: `gate:full` preferred when environment allows.

## Failure Handling

If a gate fails:

1. Fix root cause.
2. Re-run the same gate stage.
3. Do not promote with failed gate status.
