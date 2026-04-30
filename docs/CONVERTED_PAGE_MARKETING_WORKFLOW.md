# Converted-Page Marketing Workflow

End-to-end guide for the HTML → CMS → visual-editor → publish flow used to ship marketing edits on converted pages.

## Audience

Marketing operators editing copy/images/CTAs through the visual editor, plus the engineer who supports them.

## The seven-step flow

### 1. Receive HTML

You start with finished HTML for a page (handed off from design or a paid third-party tool). Drop it into the converter or place a `content.ts` + `editor-registry.ts` pair under `src/app/(site)/<page-name>/`.

### 2. Convert page

If the page came as raw HTML, run the AI converter from the Payload admin:

`Admin → Convert New Page` (visible on `/admin/converted-pages`).

Converter outputs are written to `src/app/(site)/<page-name>/`. For registered pages (those with a real `editor-registry.ts`), the visual editor will use inline-edit. Pages that fall back to a single `custom-html-block` are flagged in the upload report.

### 3. Upload to CMS

On `/admin/converted-pages`, click **Upload to CMS** for the page. The route is `POST /api/admin/upload-converted-page`. It:

- Creates or updates the matching `pages` row in Payload.
- For registered pages, persists `convertedContent` (the full default content). The visual editor reads from this on next load.
- For pages with a `formDefinitions` map in `editor-registry.ts`, upserts a Payload `forms` row per section.
- Returns a structured **upload report** (see #4).

Auth is via the admin browser cookie. Bearer-token auth (`Authorization: Bearer $PAYLOAD_SECRET`) is supported only for tooling/tests.

### 4. Read the upload report

Below the "Uploaded to CMS as draft." status row you'll see a panel with:

- **Identity strip** — `Created` or `Updated`, page id, slug, convertedPageName, title.
- **Stat cards** — section count · editable field count · image count (with missing-alt amber count if > 0) · CTA count.
- **Sections (collapsible)** — every rendered section with `F`/`I`/`C` field/image/CTA counts; chips for `[hidden]` and `[copy]` (duplicate instances).
- **Forms** — section → form id mapping for any auto-upserted forms.
- **Warnings** — soft issues only at upload time. Examples:
  - `unsupported_section` — top-level key in `convertedContent` that the registry doesn't know about.
  - `image_missing_alt` — image url set but alt empty.
  - `external_image_url` — image hosted off-origin.
  - `conversion_fallback_html` — converter wrote a `custom-html-block` because no registered registry exists.
  - `section_hidden` / `duplicate_sections` / `deleted_sections` — informational.
  - Publish-blocking codes from `validate-publish` (`cta_*`, `malformed_*`) are mirrored here as warnings so you see them before opening the editor — they will block publish until fixed.
- **Next actions** — `Open Visual Editor`, `Open Payload Page`, `Open Public Page`, `Re-run Upload`.

If the report panel doesn't appear: the route either failed (look at the status banner) or returned without a `report` field — that path falls back to the simple "Uploaded as draft" message.

### 5. Edit in the visual editor

Open via the report's **Open Visual Editor** link or the Edit ✦ button. Two routes serve this:

- `/admin/edit-converted-page/<convertedPageName>` — explicit converted-page editor.
- `/admin/visual-editor/<pageId>` — generic page editor that auto-detects converted mode when the doc has `convertedPageName`.

Status badge in the toolbar:

- **`Editing CMS page`** — the converted page has a real backing Pages row.
- **`CMS page will be created on save`** — no backing row yet; Save Draft auto-creates it.

What marketing can do, all persisted to `convertedContent`:

- Edit text inline (click the rendered element in the iframe).
- Replace images, edit alt text, toggle "Hide on public site" — image inspector and inline image-click both work.
- Reorder sections via ↑/↓ buttons in the Structure panel (or drag handle).
- Hide a section via SECTIONS panel → eye icon.
- Duplicate a section via the ⧉ button — instances are persisted under `__sectionInstances`.
- Soft-delete a section via the ✕ button — recorded in `__deletedSections`; the data is preserved.
- Adjust per-section spacing/typography overrides (SECTIONS tab → SectionStylePanel).

### 6. Save draft

Save Draft is **always allowed** — no validation, no warnings. Use it freely while iterating.

Save semantics:

- Pages with a backing doc → `PATCH /api/pages/{id}`.
- Pages without a backing doc → `POST /api/pages` (auto-create), then update local state to use the new id. Slug collision is detected: status flips to "Save failed" with the toast `"Save failed: slug already exists. Pick a different slug or open the existing CMS page."` and editor state is preserved for retry.

### 7. Publish

Click **Publish**. The pre-publish validator (`src/lib/converted-pages/validate-publish.ts`) inspects `convertedContent` and shows a modal:

- **Critical issues (block)** — only Cancel button.
  - `cta_label_without_url`, `cta_url_without_label`, `malformed_external_url`, `malformed_mailto`, `malformed_tel`.
- **Warnings only** — Cancel + Publish anyway.
  - `image_missing_alt`, `section_hidden`, `deleted_sections`, `duplicate_sections`, `suspicious_external_url`.

Validation runs only on Publish — never on Save Draft. The widget-container guard runs first; if any widget-container blocks exist, publish is blocked with a separate message until they're removed (widget editor is experimental).

### Revision restore

The toolbar 🕓 button opens revision history for the backing Pages row. For converted pages, restore re-runs the converted-mode load: re-merges defaults with the version's `convertedContent`, re-derives sections, re-registers runtime block defs, and marks the editor dirty (you must Save/Publish to commit). For non-converted pages, the existing `blocks[]` restore path is unchanged.

## Production DB note

Local dev uses **SQLite** at `payload.db`. Production uses **Postgres on Neon**. The two systems use complementary migration streams (see `CLAUDE.md` § "Dual migrations").

- **Never run migrations or seeds against production casually.** `npm run db:migrate` reads `DATABASE_URI`. Confirm what `DATABASE_URI` points at before running anything.
- **Schema parity:** when adding a Payload field, write both an `src/migrations/*.ts` (Postgres) and (only if data-transforming) an `scripts/migrations/*.ts` (SQLite). `npm run migrations:check` audits the streams.
- The widget-container Payload block is registered behind `NEXT_PUBLIC_WIDGET_EDITOR=1`. Postgres production join-tables for it are NOT yet created. **Don't enable the flag in production until those migrations are written and applied** (`pages_blocks_widget_container`, `services_blocks_widget_container`, `case_studies_blocks_widget_container`, `blog_posts_blocks_widget_container`).

## Widget editor — guarded, not core

The widget builder under `NEXT_PUBLIC_WIDGET_EDITOR=1` is experimental. Even with the flag off, any saved widget-container blocks will block publish via the toolbar guard. Don't ship widget-built pages to production until both Postgres migrations and a public renderer exist.

## Known issues / follow-ups

- **`update-page-name`** route does not yet support cookie auth via `payload.auth`. Use Bearer for now.
- **`forms` count in upload report** lists section→formId mappings; per-form field counts aren't surfaced separately.
- **Service-collection slug routing** isn't the same as converted pages — only Pages collection is reported.

## Quick reference

| What | Where |
|---|---|
| Upload route | `src/app/api/admin/upload-converted-page/route.ts` |
| Upload analyzer | `src/lib/converted-pages/upload-report.ts` |
| Validation | `src/lib/converted-pages/validate-publish.ts` |
| Editor entry | `src/payload/views/PageEditor/index.tsx` |
| Pre-publish modal | `src/payload/views/PageEditor/PrePublishModal.tsx` |
| Catch-all renderer | `src/app/(site)/[...slug]/page.tsx` |
| Hardcoded converted route example | `src/app/(site)/about/page.tsx` |
| Registry contract | `src/lib/converted-pages/types.ts` (`ConvertedPageRegistry`) |

## Tests

| Surface | Suite |
|---|---|
| `resolveRenderSections` | `src/lib/converted-pages/resolve-render-sections.test.ts` |
| Merge | `src/lib/converted-pages/merge-content.test.ts` |
| Field labels | `src/lib/converted-pages/field-labels.test.ts` |
| Validate publish | `src/lib/converted-pages/validate-publish.test.ts` |
| Upload report | `src/lib/converted-pages/upload-report.test.ts` |
| Editor adapter | `src/lib/converted-pages/editor-adapter.test.ts` |
| Revision restore (cp-* round-trip) | `src/payload/views/PageEditor/converted-restore.test.ts` |

Run `npx vitest run` to execute everything (~200 tests across the suite).
