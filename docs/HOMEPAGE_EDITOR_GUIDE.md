# Homepage Editor Guide

This guide covers the safe workflow for editing homepage content and images in Payload.

## Start
1. Run `npm run dev` (or `npm run dev:node22`).
2. Open `/admin/globals/homepage`.

## Update Text
1. Edit any text field in the relevant tab.
2. Use `Save Draft` (or wait for autosave) to see preview updates.
3. Click `Publish changes` when ready.

## Update Images (Important)
Use `imageMedia` fields in each section. Do not rely on legacy hidden image path fields.

1. Open the section tab (for example `Cases + Services`).
2. Select the target `imageMedia` field.
3. Pick existing media or upload a new file in the drawer.
4. If uploading new media, fill `Alt` (required), then save the media item.
5. Back in homepage editor, click top-right `Save`.
6. Refresh `/`.

## Common Image Field Paths
- `Hero > imageMedia`
- `About > imageMedia`
- `Cases + Services > Case Studies > Main > imageMedia`
- `Cases + Services > Case Studies > Minis[n] > imageMedia`
- `Cases + Services > Services > Items[n] > imageMedia`
- `Mission + Insights + FAQ > Mission > imageMedia`
- `Mission + Insights + FAQ > Insights > Items[n] > imageMedia`
- `About + Features > Features > Cards[n] > imageMedia`

## If Save Fails
1. Check terminal for `The following fields are invalid`.
2. If schema errors appear (`no such column ...`), run:
   - `npm run db:migrate`
3. Retry save.

## Safe DB Operations
- Before migrations or content seeding, run:
  - `npm run db:migrate:safe`
  - `npm run seed:homepage:safe`
- To create a manual snapshot:
  - `npm run db:backup -- --label manual`
- To restore a snapshot:
  - `npm run db:restore -- --file /absolute/path/to/backup-payload.db`

## Smoke Test
With local dev server running, execute:
- `npm run smoke`

Checks include:
- `GET /`
- `GET /admin`
- preview enter/exit routes
- homepage draft save through REST API (optional with `SMOKE_ADMIN_EMAIL` / `SMOKE_ADMIN_PASSWORD`)

## Admin Health Check
With local dev server running, execute:
- `npm run health:admin`

Checks include:
- `/admin` responds with `200`
- `/admin/globals/homepage` responds with `200`
- response duration for both endpoints (for quick regression spotting)

## Rollout Gates
Use staged verification gates before promotion:

- `npm run gate:local` (schema + build checks)
- `npm run gate:runtime` (admin health + runtime smoke checks, requires running server)
- `npm run gate:full` (local + runtime)

See `docs/ROLLOUT_VERIFICATION_GATES.md` for policy and failure handling.

## Notes
- Autosave writes draft updates; use main `Save` to persist final document changes.
- The landing page reads structured fields as the single runtime source of truth.

## If Admin Is Slow, Unstyled, or Stuck
1. Ensure only one dev server is running:
   - `lsof -iTCP:3000 -sTCP:LISTEN -n -P`
2. If multiple `next dev` instances are active, stop stale ones:
   - `kill <PID>`
3. Restart clean:
   - `npm run dev`
4. Re-check schema + admin endpoints:
   - `npm run db:verify`
   - `npm run health:admin`
5. If homepage global editor fails specifically, re-run migrations:
   - `npm run db:migrate`
   - then reload `/admin/globals/homepage`.

## Draft Preview Workflow
Use preview mode to review draft changes before final publish.

1. Enter preview from admin `Preview Site` button, or manually:
   - local dev: `/api/preview?slug=/`
   - with explicit secret: `/api/preview?secret=YOUR_PREVIEW_SECRET&slug=/`
2. Review homepage draft at `/`.
   - Live preview auto-refreshes roughly every 1-2 seconds while draft mode is active.
3. Exit preview:
   - `/api/exit-preview?slug=/`
