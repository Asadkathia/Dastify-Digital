# SEO + WordPress-Parity Roadmap and Progress Log

Related Tracker: [Storyblok Integration Roadmap and Worklog](./STORYBLOK_INTEGRATION_ROADMAP_AND_WORKLOG.md)

## Goals and Locked Decisions
- Full SEO control from Payload admin (meta, canonical, noindex, OG/Twitter, JSON-LD).
- Multi-page architecture with Pages, Services, Case Studies, Blog.
- WordPress-parity admin workflows (menus, redirects, forms, drafts, scheduling, preview).
- Keep existing homepage working during rollout.
- Locked defaults:
  - Pages-centric model while keeping Homepage global initially.
  - URL shape: `/services/[slug]`, `/case-studies/[slug]`, `/blog/[slug]`, `/blog/category/[slug]`, `/blog/tag/[slug]`.
  - Forms/search v1: admin storage/indexing only.

## Completion Convention
- Mark done with checkbox + strikethrough, e.g. `- [x] ~~Implement sitemap route~~`.
- When all tasks in a phase are complete, strike through the phase heading line.

## Phased Roadmap

### ~~Phase 0: Foundation + Compatibility Hardening~~
- [x] ~~Node 22-safe Payload CLI/migrations flow.~~
- [x] ~~CMS slug/URL constants and helpers.~~
- [x] ~~Site settings global scaffold.~~
- [x] ~~Create this roadmap + progress tracker file.~~

### ~~Phase 1: Core CMS Models + Plugins~~
- [x] ~~Configure plugins: SEO, nested docs, redirects, form-builder, search.~~
- [x] ~~Add collections: pages, services, case studies, blog posts, categories, tags.~~
- [x] ~~Add page-builder blocks.~~
- [x] ~~Keep Homepage global intact.~~
- [x] ~~Re-enable Lexical safely for rich text fields.~~

### ~~Phase 2: Frontend Routing + Rendering + Metadata~~
- [x] ~~Add routes: services/case-studies/blog/category/tag/paginated archive/catch-all pages.~~
- [x] ~~Add `generateStaticParams()` for static candidates.~~
- [x] ~~Build typed CMS fetch layer.~~
- [x] ~~Implement route-level `generateMetadata()` via shared SEO mapper.~~

### ~~Phase 3: SEO Infrastructure Endpoints~~
- [x] ~~Implement `src/app/sitemap.ts`.~~
- [x] ~~Implement `src/app/robots.ts`.~~
- [x] ~~Implement `/feed.xml` RSS route.~~
- [x] ~~Add JSON-LD output per page type.~~
- [x] ~~Add fallback OG image route.~~

### ~~Phase 4: Admin WordPress-Parity Features~~
- [x] ~~Admin-managed menus + frontend consumption.~~
- [x] ~~Redirect runtime wiring.~~
- [x] ~~Form-builder enablement (admin submissions v1).~~
- [x] ~~Search indexing setup (admin/indexing v1).~~
- [x] ~~Draft preview extension to all draft-enabled types.~~

### ~~Phase 5: Technical SEO + Semantics + Images~~
- [x] ~~Add semantic `<main>` landmark and heading cleanup.~~
- [x] ~~Migrate homepage raw `<img>` to `next/image`.~~
- [x] ~~Improve internal linking.~~
- [x] ~~Add cache revalidation pipeline from content hooks.~~

### ~~Phase 6: Migration + Rollout + Safety~~
- [x] ~~Ensure Postgres + SQLite migration parity for new schema.~~
- [x] ~~Add seed/backfill scripts for new globals/collections.~~
- [x] ~~Define staged rollout + verification gates.~~

## Progress Log
- 2026-04-02: Created canonical roadmap/progress tracker (`docs/SEO_ROADMAP_AND_PROGRESS.md`).
- 2026-04-03: Added foundation scaffolding (site settings global, CMS URL/slug/query/SEO utilities, revalidation endpoint/hooks).
- 2026-04-03: Added new CMS collections and plugins (pages/services/case-studies/blog categories/tags/posts/menus, SEO + nested docs + redirects + search).
- 2026-04-03: Added multi-route frontend layer with metadata and JSON-LD (`/services/*`, `/case-studies/*`, `/blog/*`, catch-all pages).
- 2026-04-03: Added technical SEO endpoints (`/sitemap.xml`, `/robots.txt`, `/feed.xml`, `/og`) and middleware redirect handling.
- 2026-04-03: Added semantic `<main>` landmark and migrated homepage image tags to `next/image` via `CmsImage`.
- 2026-04-03: Build validated successfully (`npm run build`).
- 2026-04-03: Enabled form-builder plugin with safe field overrides (converted plugin rich-text fields to `textarea` for CLI compatibility), added follow-up locked-doc relations migration, and revalidated (`payload:types`, `payload:importmap`, `db:migrate`, `build`).
- 2026-04-03: Resolved local SQLite schema drift causing admin failures (`no such table/column` across blog/menu/forms/search/site-settings). Backed up and reset local `payload.db`, then rebuilt schema successfully (admin `/admin` returned 200, build passed).
- 2026-04-03: Added cross-database schema verification gate (`npm run db:verify`) and wired it into startup (`predev`, `dev:node22`) to enforce SQLite/Postgres parity on critical CMS tables/columns before app boot.
- 2026-04-03: Added baseline CMS seed/backfill script (`npm run seed:cms-baseline`) for `site-settings` + default `header/footer` menus and linked items, with safe wrapper (`seed:cms-baseline:safe`).
- 2026-04-03: Added staged rollout gate runner (`gate:local`, `gate:runtime`, `gate:full`) with policy doc (`docs/ROLLOUT_VERIFICATION_GATES.md`) and validated `gate:local` pass.
- 2026-04-03: Improved internal linking across homepage navigation and CTA surfaces (services/case-studies/blog/archive paths) and removed dead `#` placeholders from default primary footer/navigation link targets.
- 2026-04-03: Re-enabled Lexical for form-builder rich text safely by switching to lazy Lexical adapter loading (`import()` in async config export) and recursive editor injection for plugin rich-text fields; validated `payload:types`, `payload:importmap`, and `build`.
- 2026-04-03: Added admin runtime health gate (`npm run health:admin`) and wired it into rollout runtime/full gates so `/admin` and `/admin/globals/homepage` regressions fail fast.
- 2026-04-03: Re-ran `gate:full` after admin/schema recovery; all local + runtime checks passed (`db:migrate`, `db:verify`, baseline seed, production build, admin health, smoke).
- 2026-04-03: Fixed Next image sizing warning source in `CmsImage` non-fill mode by preserving intrinsic aspect ratio (`height: auto`).

## Risks / Blockers / Decisions Log
- Decision: Keep Homepage global during transition to reduce regression risk.
- Risk: Lexical import path may re-trigger historical CLI compatibility issue; enforce Node 22-safe generation flow.
- Decision: Keep form-builder v1 rich content as `textarea` instead of `richText` until Lexical is re-enabled safely across CLI/build workflows.
- Decision: SQLite custom migration runner now executes idempotent migrations every run (stateless) to avoid auxiliary migration tables interfering with Drizzle schema sync in dev.
- Mitigation: Added `db:verify` parity gate for both SQLite (`libsql`) and Postgres (`pg`) to fail fast on critical schema drift before runtime admin errors.
- Mitigation: Keep emergency fallback flag `PAYLOAD_DISABLE_LEXICAL=true` to force textarea mode if needed.
- Mitigation: Added `health:admin` runtime check and included it in `gate:runtime` / `gate:full` to catch admin endpoint regressions before rollout.

## Update Policy
- Update this file after every implementation session.
- Add a dated entry for every meaningful milestone.
- Strike out completed tasks/phases as work lands.

## Active SEO TODO (2026-04-03)
- [x] Wire dynamic OG image fallback (`/og?title=...`) into shared metadata builder when explicit OG image is absent.
- [x] Add RSS discovery metadata (`application/rss+xml`) via shared metadata builder.
- [x] Remove duplicate site-layout metadata fetch so route pages own final metadata.
- [x] Inject Google Analytics script from `site-settings.googleAnalyticsId`.
- [x] Ensure per-document `meta` includes `canonicalURL`, `noindex`, and `keywords` for `pages`, `services`, `case-studies`, `blog-posts` (via SEO plugin `fields` override).
- [ ] Decide and document static params strategy (fully dynamic vs selective ISR pre-generation).

### 2026-04-03 Implementation Notes (Current Pass)
- Implemented metadata enhancements in `src/lib/seo/metadata.ts`:
  - dynamic OG fallback route wiring
  - RSS feed alternate link metadata
  - `twitter.site` alignment with `twitterHandle`
- Simplified site layout metadata ownership and added GA runtime injection in `src/app/(site)/layout.tsx`.
- Added schema migration `20260403_0008_collection_seo_extra_columns` to support `meta.canonicalURL`, `meta.noindex`, `meta.keywords` columns in collection + version tables.
- Updated `seoPlugin` config in `payload.config.ts` to append `canonicalURL`, `noindex`, and `keywords` to the plugin-injected `meta` group for configured collections/globals.
- Added schema migration `20260403_0009_global_seo_extra_columns` for global tables (`homepage`, `_homepage_v`, `site_settings`) to match expanded SEO plugin fields.
- Validation completed:
  - `npm run db:migrate`
  - `npm run payload:types`
  - `npm run payload:importmap`
  - `npm run db:verify`
  - `npm run build`
- During implementation, attempting to add explicit collection `meta` fields caused Payload `DuplicateFieldName('meta')`; this confirms `seoPlugin` already injects `meta` for configured collections.
