# Storyblok Integration Roadmap and Worklog

## Scope
- Storyblok is the visual page source for catch-all pages (`/[...slug]`) behind `ENABLE_STORYBLOK`.
- Payload remains source of truth for homepage/blog/services/case-studies and fallback for `pages`.
- SEO for Storyblok-rendered pages comes from Storyblok story fields; all non-Storyblok routes keep existing Payload SEO flow.

## Completion Convention
- Mark done with checkbox + strikethrough, for example: `- [x] ~~Implement Storyblok preview route~~`.
- When a phase is fully complete, strike through the phase heading line.

## Roadmap

### ~~Phase 1: Environment + Config~~
- [x] ~~Install `@storyblok/react`.~~
- [x] ~~Add Storyblok image host (`a.storyblok.com`) to Next image `remotePatterns`.~~
- [x] ~~Add Storyblok env contract to `.env.example` + `.env.vercel.example`.~~

### ~~Phase 2: Storyblok Client + SEO Mapper~~
- [x] ~~Create `src/lib/storyblok.ts` with draft/published fetch helper.~~
- [x] ~~Add Storyblok SEO extraction (`seo_title`, `seo_description`, `seo_image`, `noindex`).~~
- [x] ~~Implement root slug normalization (`/` -> `home` by default).~~

### ~~Phase 3: Shared Block Rendering~~
- [x] ~~Create presentational blocks in `src/components/blocks/` (Hero, RichText, TextImage, CTA, FAQ, Stats, Testimonials).~~
- [x] ~~Add normalized payload block mapper and `PageBlocksRenderer`.~~
- [x] ~~Use shared renderer for Payload `pages` fallback in catch-all route.~~

### ~~Phase 4: Storyblok Adapters + Registration~~
- [x] ~~Add Storyblok registry module in `src/components/storyblok/index.tsx`.~~
- [x] ~~Map Storyblok components (`hero`, `rich_text`, `text_image`, `cta`, `faq`, `stats`, `testimonials`) to presentational blocks.~~
- [x] ~~Add `storyblokEditable(...)` wrappers for visual editor block selection.~~
- [x] ~~Add `StoryblokBridgeLoader` (client) for draft-mode visual editing bridge.~~

### ~~Phase 5: Catch-All Routing + Metadata~~
- [x] ~~Update `src/app/(site)/[...slug]/page.tsx` for Storyblok-first lookup when `ENABLE_STORYBLOK=true`.~~
- [x] ~~Implement Payload fallback behavior when no Storyblok story exists.~~
- [x] ~~Update metadata precedence: Storyblok SEO -> Payload SEO -> site defaults.~~

### ~~Phase 6: Preview + Webhooks~~
- [x] ~~Add `src/app/api/storyblok-preview/route.ts` with secret validation + draft mode redirect.~~
- [x] ~~Extend `src/app/api/revalidate/route.ts` to handle Storyblok webhook shape (`action`, `story.full_slug`) while preserving Payload shape.~~
- [x] ~~Return normalized revalidate response (`source`, `paths`, `tags`, `ignoredReason`).~~

### Phase 7: Verification + Rollout
- [ ] Run full build/type verification and resolve any integration issues.
- [ ] Validate local runtime scenarios:
  - Storyblok disabled -> Payload-only catch-all behavior.
  - Storyblok enabled + no story -> Payload fallback works.
  - Storyblok enabled + published `/about` story -> Storyblok rendering path works.
- [ ] Validate preview endpoint (`/api/storyblok-preview`) with valid/invalid secret.
- [ ] Validate webhook endpoint for both Payload and Storyblok payload shapes.
- [ ] Flip `ENABLE_STORYBLOK=true` only after validation passes.

## Active Tasks
- [ ] Complete Phase 7 verification checklist.
- [ ] Manually configure Storyblok dashboard (preview URL, block schema, page content type, webhook headers/secrets).

## Progress Log
- 2026-04-03: Added Storyblok package and env/config scaffolding (`@storyblok/react`, env examples, Next image host).
- 2026-04-03: Added Storyblok client module (`src/lib/storyblok.ts`) with slug normalization and SEO extraction helpers.
- 2026-04-03: Added presentational page blocks + payload block mapper + shared block renderer.
- 2026-04-03: Added Storyblok component registry/adapters with editable wrappers and draft bridge loader.
- 2026-04-03: Updated catch-all page route and metadata for feature-flagged Storyblok-first rendering with Payload fallback.
- 2026-04-03: Added Storyblok preview endpoint and extended revalidation endpoint for Storyblok webhooks.

## Blockers / Notes
- Storyblok dashboard setup (space schema, tokens, webhook URL/secret, preview URL) is manual and must match this implementation.
- Keep `ENABLE_STORYBLOK=false` until runtime verification is completed.
