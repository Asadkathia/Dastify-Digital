# Converted Pages Editor Roadmap

## Objective
Upgrade converted pages so the existing HTML-to-converted-page workflow remains intact while converted output becomes editor-aware: inline-editable, style-inspectable, semantically editable, and persistently controllable through `convertedContent`.

## Non-goals
- No workflow changes for `/admin/convert-page`, `/admin/converted-pages`, or CMS publish flow.
- No regressions in generic page blocks or homepage editor behavior.
- No persistence through raw DOM mutation or raw HTML snapshots for registered converted pages.
- No broad global CSS rewrites or changes to shared public components outside converted-page support.

## Current State Summary
- Converter entry: `src/app/api/admin/convert-page/route.ts`
- Prompt builder: `src/lib/page-converter/prompt.ts`
- Generated file shape: `src/app/(site)/<page>/components/*`, `page.tsx`, `content.ts`
- Converted-page adapter: `src/lib/converted-pages/editor-adapter.ts`
- Preview rendering path: `src/app/(site)/page-editor-preview/page.tsx`
- Upload-to-CMS path: `src/app/api/admin/upload-converted-page/route.ts`
- Existing converted pages in repo: `about`, `services-convert`
- Source brand book: `/Users/asad/Projects/Dastify-Digital/dastify-digital-animated-sections.html`

## Compatibility Matrix
| Surface | Required Outcome | Status |
| --- | --- | --- |
| Generic page blocks | Existing inline editing and save flow unchanged | In Progress |
| Homepage visual editor | Existing preview and editing unchanged | In Progress |
| Converted pages in visual editor | Inline text, CSS inspection, semantic tag control, persisted style editing | Runtime Hardened |
| Uploaded CMS converted pages | Save/load/publish/live render parity with converted editor | Partially Verified |
| Legacy converted pages without new metadata | Must keep rendering and inspector editing; inline/style features may fail soft | Pending |

## Locked Decisions
- `convertedContent` remains the single persistence source of truth for converted pages.
- Computed CSS inspection is supported, but persistence writes only structured editor-owned style fields.
- Brand-book guidance is read from the repo-local HTML file and normalized at prompt-build time.
- Page-specific generated CSS remains slug-scoped.
- Selected converted elements will bind through explicit metadata attributes in preview DOM.

## Open Decisions
- None currently. Use structured style fields under section-local editor metadata.

## Phases
### CP-00 Baseline and safeguards
- [x] Create roadmap/progress file.
- [x] Capture pipeline, compatibility matrix, guardrails, and verification surfaces.

### CP-01 Brand-book ingestion
- [x] Add a brand-book normalization layer for the repo-local HTML source.
- [x] Feed normalized brand guidance into the converter prompt.
- [x] Update prompt rules to require editor-aware converted output.

### CP-02 Converted output contract
- [x] Add shared converted-editor metadata types for semantic tags and styles.
- [x] Extend converter prompt contract to require content/style/tag bindings and editor metadata.
- [x] Keep generated components page-scoped and compatible with existing route structure.

### CP-03 Preview binding and inline editing
- [x] Add dotted-path writeback support for converted block data.
- [x] Extend preview/iframe protocol with selected-node inspection and semantic/style update support.
- [x] Preserve existing inline editing flow for generic blocks.

### CP-04 CSS inspection and persisted style control
- [x] Capture computed style info for selected converted nodes in preview.
- [x] Add selected-node inspector controls for persisted style fields.
- [x] Persist style edits through `convertedContent` round-trip helpers.

### CP-05 Semantic controls
- [x] Add heading/tag control for converted heading nodes.
- [x] Ensure preview/live render honor persisted semantic tag values.

### CP-06 Legacy compatibility and CMS round-trip
- [x] Use fallback defaults when editor metadata is missing.
- [x] Keep legacy converted pages renderable and inspector-editable.
- [x] Preserve upload-to-CMS path for registered converted pages.

## File/System Ownership
- Prompt + brand normalization: `src/lib/page-converter/*`
- Converted metadata/path helpers: `src/lib/converted-pages/*`, `src/components/converted-editor/*`
- Preview binding + message protocol: `src/app/(site)/page-editor-preview/page.tsx`, `src/payload/views/PageEditor/*`
- Existing converted-page components: `src/app/(site)/about/components/*`, `src/app/(site)/services-convert/components/*`
- Progress tracking: this file

## Risks and Rollback Notes
- Largest regression risk is preview message/protocol drift between iframe and editor. Producer and consumer must change together.
- Existing converted pages may not have explicit editor metadata in `content.ts`; fallback behavior must preserve render output.
- If a converted component binding causes preview instability, remove the specific node annotation rather than broadening scope into generic blocks.

## Verification Checklist
- [x] Brand-book summary is included in converter prompt.
- [x] Converted titles, leads, labels, and CTA text are wired for inline editing in preview.
- [x] Selected converted node shows computed style inspection data.
- [x] Converted heading tag changes have a persisted binding path and render through shared converted helpers.
- [x] Converted style edits have persisted binding paths and render through shared converted helpers.
- [x] Live converted route falls back safely to registered default content when CMS `convertedContent` is partial/corrupted.
- [ ] Generic block inline editing still works.
- [ ] Homepage editor still works.
- [ ] Uploading a registered converted page to CMS still works.

## Worklog
### 2026-04-13
- Created roadmap and locked implementation guardrails.
- Implemented brand-book normalization/prompt integration.
- Added converted editor metadata types, path utilities, preview inspection protocol, and converted inspector controls.
- Annotated existing converted page components for direct inline editing and semantic/style bindings.
- Verified `npx tsc --noEmit` passes after the implementation.
- Started runtime verification pass for generic blocks, homepage editor, and converted CMS round-trip.
- Runtime hardening in progress for converted components that still assume complete array/string data during preview round-trips.
- Added converted-content fallback merging so live/CMS converted pages render safely even when stored `convertedContent` is structurally partial.
- Verified `GET /services` returns `200` after merging registered default converted content with the saved CMS override payload.
- Verified `GET /page-editor-preview?mode=converted-page&page=services-convert` returns `200`.
- **PHASE A (Converted-page inline editing)**: In Progress
- Investigating converted repeater inline-edit corruption: editing `services.items.*` via inline text can collapse the JSON-backed `items` field to a partial structure.
- Fixed converted repeater inline-edit writeback in `store.ts`: dotted edits against JSON-backed fields now mutate parsed JSON and reserialize it, instead of replacing the full array/blob with a partial nested structure.

## Final Acceptance Checklist
- [ ] HTML conversion workflow unchanged from the user’s perspective.
- [ ] Brand-book guidance materially influences generated converted output.
- [ ] New converted pages are editor-aware by prompt contract.
- [ ] Existing converted pages in repo support inline editing, CSS inspection, and heading/tag control where annotated.
- [ ] Roadmap stays accurate as the implementation artifact for future agents.
