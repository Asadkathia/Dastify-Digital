# Import Agent Pipeline Progress

## Goal
Build an AI-assisted HTML -> Payload Pages import pipeline that always writes draft pages in valid `pages.blocks` topology and preserves unmapped sections via `custom-html-block`.

## Task Checklist
- [x] Read existing `src/lib/import-agent/types.ts`
- [x] Read existing `src/lib/import-agent/parse-html.ts`
- [x] Implement `build-seo.ts`
- [x] Implement AI abstraction (`src/lib/ai/*`)
- [x] Implement `map-to-blocks.ts`
- [x] Implement `validate-blocks.ts`
- [x] Implement orchestrator `src/lib/import-agent/index.ts`
- [x] Implement API route `src/app/api/admin/import-page/route.ts`
- [x] Create `ImportReports` collection
- [x] Create admin view `PageImporter`
- [x] Register collection + admin view in `payload.config.ts`
- [x] Register admin view in `importMap.js`
- [x] Run `npx tsc --noEmit`

## Work Log

### 2026-04-07
- Created progress tracker.
- Verified existing parser/type contracts.
- Started implementation of AI provider layer, mapping, validation, orchestrator, API route, and admin registrations.
- Added `build-seo.ts` SEO extractor.
- Added AI provider abstraction (`anthropic`, `openai`, `google`, `openrouter`, `ollama`) and prompt builder.
- Added AI mapping step with structured JSON parse + raw response error capture.
- Added deterministic validator with topology enforcement, required-field checks, fallback behavior, and unresolved image warnings.
- Added import orchestrator that creates draft pages + import reports through Payload local API.
- Added admin API route at `/api/admin/import-page` with session/authorization guard.
- Added `ImportReports` collection and registered it in `payload.config.ts`.
- Added admin `PageImporter` view and registered it in both `payload.config.ts` and `importMap.js`.
- Added sidebar nav link component for importer (`PageImporterNavLink`) and registered in admin `beforeNavLinks`.
- Updated parser regexes to avoid unsupported `s` regex flag under current TS target.
- Completed `npx tsc --noEmit` with zero errors.

### 2026-04-08
- Hardened Gemini response parsing in `map-to-blocks.ts`:
  - Added fenced-JSON extraction (` ```json ... ``` ` handling).
  - Added fallback extraction of largest `{...}` JSON slice.
- Improved Google adapter in `src/lib/ai/providers/google.ts`:
  - Join all candidate text parts (not only the first part).
  - Request `responseMimeType: "application/json"` to bias valid JSON output.
- Added deterministic block normalization in `validate-blocks.ts` before validation:
  - Coerce common alias fields (e.g. hero `description` -> `subtitle`, CTA aliases).
  - Convert Lexical/object content into plain strings for blocks that expect strings.
  - Normalize `accordion`, `faq`, `tabs`, `stats`, `testimonials`, `card-grid`, `social-icons`, `button`, `heading`, `image`, `alert`.
  - Extended unresolved-image warnings to handle nested object/array `src` values.
- Tightened prompt constraints in `src/lib/ai/prompt.ts`:
  - Explicitly require exact field names for common blocks.
  - Explicitly forbid Lexical JSON in string content fields.
- Re-ran `npx tsc --noEmit` with zero errors.
