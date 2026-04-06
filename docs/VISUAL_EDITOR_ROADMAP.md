# Visual Page Editor — Roadmap, Tasks & Work Log

A custom Elementor-style drag-and-drop visual editor built inside Payload CMS admin.
Marketers compose pages from pre-built blocks on a live canvas — no coding required.

---

## Completion Convention
- Completed: `- [x] ~~Task description~~`
- In progress: `- [ ] **Task description** ← IN PROGRESS`
- Pending: `- [ ] Task description`

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  Payload Admin  (/admin)                            │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Visual Editor  (/admin/visual-editor/:id)    │  │
│  │                                               │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌─────────┐ │  │
│  │  │  Block   │  │    Canvas    │  │ Config  │ │  │
│  │  │ Palette  │  │   (iframe)   │  │  Panel  │ │  │
│  │  │          │  │              │  │         │ │  │
│  │  │ [Hero]   │  │  ┌────────┐  │  │ Title   │ │  │
│  │  │ [CTA]    │  │  │ Hero  ◄├──┼──│ Subtitle│ │  │
│  │  │ [FAQ]    │  │  ├────────┤  │  │ Image   │ │  │
│  │  │ [Stats]  │  │  │  CTA   │  │  │ CTA URL │ │  │
│  │  │ [Text+]  │  │  ├────────┤  │  │         │ │  │
│  │  │ [Rich]   │  │  │  FAQ   │  │  │ [Save]  │ │  │
│  │  │ [Testi]  │  │  └────────┘  │  │ [Pub]   │ │  │
│  │  └──────────┘  └──────────────┘  └─────────┘ │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Technology stack:**
- Drag-and-drop: `@dnd-kit/core` + `@dnd-kit/sortable`
- State + undo/redo: `zustand` + `zundo` temporal middleware
- Preview iframe ↔ editor: `postMessage` API
- Inline text editing: `contenteditable` overlay
- Save/publish: Payload REST API (`/api/pages/:id`)

**Data flow:**
```
Editor store (zustand) → serializeToPayload() → PATCH /api/pages/:id
Payload DB             → loadFromPayload()    → Editor store (zustand)
Editor store (zustand) → postMessage()        → Preview iframe
Preview iframe click   → postMessage()        → Editor (select block)
```

---

## ~~Phase 1 — Foundation~~

### ~~Setup~~
- [x] ~~Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`~~
- [x] ~~Install `zustand`, `zundo`~~

### ~~Core Modules~~
- [x] ~~Create `src/payload/views/PageEditor/block-registry.ts`~~
  - All 7 blocks defined with fields, defaults, labels, icons, categories
- [x] ~~Create `src/payload/views/PageEditor/store.ts`~~
  - Zustand store with `temporal` middleware for undo/redo
  - Actions: addBlock, removeBlock, moveBlock, duplicateBlock, updateBlockData, selectBlock
  - Load from Payload and serialize back to Payload formats

---

## ~~Phase 2 — UI Panels~~

### ~~Editor Shell~~
- [x] ~~Create `src/payload/views/PageEditor/index.tsx`~~
  - 3-panel layout: palette | canvas | config
  - Toolbar: save draft, publish, undo, redo, responsive toggle, back link

### ~~Block Palette (Left Panel)~~
- [x] ~~Create `src/payload/views/PageEditor/BlockPalette.tsx`~~
  - Blocks grouped by category (Layout / Content / Conversion)
  - Each block is draggable using `useDraggable`
  - Block thumbnails with icon + label

### ~~Canvas (Center Panel)~~
- [x] ~~Create `src/payload/views/PageEditor/Canvas.tsx`~~
  - Sortable block list using `@dnd-kit/sortable`
  - Drop zone between blocks
  - Block cards with drag handle, hover toolbar (delete, duplicate)
  - Click to select → opens config panel
  - Empty state with quick-add buttons

### ~~Config Panel (Right Panel)~~
- [x] ~~Create `src/payload/views/PageEditor/ConfigPanel.tsx`~~
  - Renders field inputs from block registry definition
  - Field types: text, textarea, select, upload (URL-based), checkbox, array
  - Each change: updates store → marks dirty → pushes to undo stack
- [x] ~~Create `src/payload/views/PageEditor/ArrayFieldEditor.tsx`~~
  - Sortable sub-items with add/remove/reorder

---

## ~~Phase 3 — Preview Iframe~~

### ~~Iframe Setup~~
- [x] ~~Create `src/app/page-editor-preview/page.tsx`~~
  - Receives blocks via `postMessage`
  - Renders using `PageBlocksRenderer`
  - Block highlight overlay: click-to-select, selected blue border

### ~~postMessage Bridge~~
- [x] ~~Create `src/payload/views/PageEditor/PreviewIframe.tsx`~~
  - Iframe wrapper component
  - Sends `UPDATE_BLOCKS` on every store change (debounced 120ms)
  - Sends `SELECT_BLOCK` when config panel selects a block
  - Listens for `BLOCK_CLICKED` from iframe → selects block in editor
  - Responsive toggle: desktop (100%) / tablet (768px) / mobile (375px)

### ~~Inline Editing~~
- [x] ~~Implement `contenteditable` overlay in preview iframe~~
  - Double-click text → becomes editable in place
  - On blur → sends `INLINE_EDIT_END` → store updates
  - Enter/Escape to confirm, Shift+Enter for newline
  - `PreviewIframe` receives `INLINE_EDIT_END` and calls `updateBlockData`

---

## ~~Phase 4 — Save, Publish, Sync~~

- [x] ~~Wire "Save Draft" → PATCH `/api/pages/:id` with `_status: 'draft'`~~
- [x] ~~Wire "Publish" → PATCH `/api/pages/:id` with `_status: 'published'`~~
- [x] ~~Load existing page blocks from Payload on editor mount~~
- [x] ~~Auto-save debounced every 30s while dirty~~
- [x] ~~Dirty indicator: "Unsaved changes" / "Saving…" / "Saved" / "Save failed" in toolbar~~
- [x] ~~Unsaved changes confirmation on navigate-away (beforeunload guard)~~

---

## ~~Phase 5 — Payload Integration~~

- [x] ~~Register custom admin view in `payload.config.ts`~~
  - Route: `/admin/visual-editor/:id`
  - Component: `/src/payload/views/PageEditor/index#default`
- [x] ~~Add "Visual Editor" button component (`src/payload/components/VisualEditorButton.tsx`)~~
  - Registered on Pages collection via `admin.components.afterList`
- [x] ~~Add "Visual Editor" action button to Pages document edit view~~
  - `VisualEditorDocButton.tsx` — uses `useDocumentInfo()` to get page ID
  - Registered via `admin.components.edit.SaveButton` on Pages collection

---

## ~~Phase 6 — Polish & UX~~

### ~~Keyboard Shortcuts~~
- [x] ~~`Ctrl+Z` / `Ctrl+Shift+Z` — undo / redo~~
- [x] ~~`Ctrl+S` — save draft~~
- [x] ~~`Ctrl+Shift+S` — publish~~
- [x] ~~`Delete` — delete selected block~~
- [x] ~~`Ctrl+D` — duplicate selected block~~
- [x] ~~`↑` / `↓` — move block up/down~~
- [x] ~~`Escape` — deselect block~~

### ~~Templates~~
- [x] ~~Create `src/payload/views/PageEditor/block-templates.ts`~~
- [x] ~~Landing page template (Hero + Stats + Testimonials + CTA + FAQ)~~
- [x] ~~Service page template (Hero + TextImage + Stats + CTA)~~
- [x] ~~About page template (Hero + RichText + Stats + Testimonials + CTA)~~
- [x] ~~Contact page template (Hero + TextImage + FAQ)~~
- [x] ~~Template picker in empty state (with descriptions and icons)~~

### ~~UX Details~~
- [x] ~~Skeleton loaders while Payload data loads~~
- [x] ~~Error boundary around preview iframe~~
- [ ] Connection-lost indicator if postMessage fails
- [x] ~~Toast notifications for save/publish success/error~~
- [x] ~~Block count indicator in canvas header~~

---

## ~~Phase 7 — Advanced (Post-MVP)~~

- [x] ~~Copy/paste blocks between pages (clipboard serialization)~~
- [x] ~~Block visibility: show/hide on specific breakpoints~~
- [ ] Global blocks: reusable blocks saved as Payload documents
- [x] ~~Per-block background color override~~
- [x] ~~Per-block spacing (padding top/bottom) controls~~
- [ ] Per-block animation setting
- [x] ~~Multi-column layout block (2-col, 3-col grid wrapper)~~
- [ ] Form block integration (Payload form-builder plugin)
- [x] ~~Revision history sidebar (list Payload versions, restore)~~
- [ ] `generateStaticParams` population from Payload published pages

---

## ~~Phase 8 — Productivity & Editing Enhancements~~

- [x] ~~Apply persisted `_styles` in preview iframe (padding + background)~~
- [x] ~~Breakpoint-aware preview visibility (`hiddenOn`) using live `responsiveMode`~~
- [x] ~~Block palette search (filter by block label)~~
- [x] ~~Canvas block finder + jump-to-first-match~~
- [x] ~~`Ctrl+F` shortcut to focus canvas finder~~
- [x] ~~Toolbar page title inline editing, persisted with save/publish~~
- [x] ~~Canvas card data summary badge (item/char metadata)~~

---

## File Structure

```
src/payload/views/PageEditor/
├── index.tsx                  ← Main 3-panel editor layout + toolbar
├── store.ts                   ← Zustand + zundo state store
├── block-registry.ts          ← Block definitions, defaults, field schemas
├── block-templates.ts         ← Pre-built page templates (Phase 6)
├── BlockPalette.tsx           ← Left panel: draggable block catalogue
├── Canvas.tsx                 ← Center panel: sortable block stack
├── ConfigPanel.tsx            ← Right panel: selected block field editor
├── BlockPreview.tsx           ← Compact block card for canvas list
├── PreviewIframe.tsx          ← Iframe wrapper + postMessage bridge
├── Toolbar.tsx                ← Save, publish, undo/redo, responsive toggle
├── MediaPickerField.tsx       ← Upload field using Payload media modal
├── ArrayFieldEditor.tsx       ← Repeatable items editor (FAQ, Stats, etc.)
├── KeyboardShortcuts.tsx      ← Global keyboard shortcut handler (Phase 6)
└── types.ts                   ← Editor-specific TypeScript types

src/app/page-editor-preview/
└── page.tsx                   ← Preview iframe renderer + postMessage listener

src/payload/components/
├── VisualEditorNavLink.tsx    ← Sidebar nav link to visual editor
└── VisualEditorButton.tsx     ← "Visual Editor" button in Pages list cells
```

---

## Active Tasks
- [ ] Global blocks: reusable blocks saved as Payload documents
- [ ] Per-block animation setting
- [ ] Form block integration (Payload form-builder plugin)
- [ ] `generateStaticParams` population from Payload published pages
- [ ] Connection-lost indicator if postMessage fails

---

## Work Log

### 2026-04-04 (session 2)
- Initiated custom visual page editor implementation
- Created roadmap/worklog tracker (`docs/VISUAL_EDITOR_ROADMAP.md`)
- Installed `@dnd-kit/core ^6.3.1`, `@dnd-kit/sortable ^10.0.0`, `@dnd-kit/utilities`, `zustand ^5.0.12`, `zundo ^2.3.0`
- Built complete Phase 1 (Foundation):
  - `src/payload/views/PageEditor/types.ts` — all TypeScript types for editor, fields, messages
  - `src/payload/views/PageEditor/block-registry.ts` — all 7 blocks with fields, defaults, icons
  - `src/payload/views/PageEditor/store.ts` — Zustand + zundo temporal store, full CRUD + undo/redo
- Built complete Phase 2 (UI Panels):
  - `src/payload/views/PageEditor/BlockPalette.tsx` — left panel, 3 categories, draggable blocks
  - `src/payload/views/PageEditor/Canvas.tsx` — center panel, sortable list, drop zones, empty state
  - `src/payload/views/PageEditor/ConfigPanel.tsx` — right panel, all field types
  - `src/payload/views/PageEditor/ArrayFieldEditor.tsx` — repeatable items with reorder/add/delete
  - `src/payload/views/PageEditor/index.tsx` — 3-panel shell, toolbar, DnD context, auto-save
- Built complete Phase 3 (Preview):
  - `src/app/page-editor-preview/page.tsx` — iframe renderer, postMessage listener, click-to-select overlay
  - `src/payload/views/PageEditor/PreviewIframe.tsx` — iframe wrapper, debounced UPDATE_BLOCKS, responsive modes
- Built complete Phase 4 (Save/Publish): save draft, publish, 30s auto-save, save status indicator
- Built complete Phase 5 (Payload Integration):
  - Registered `/admin/visual-editor/:id` route in `payload.config.ts`
  - Created `src/payload/components/VisualEditorButton.tsx`
  - Added button to Pages collection via `admin.components.afterList`
- TypeScript: `tsc --noEmit` passes with zero errors

### 2026-04-04 (session 2)
- Built complete Phase 6 (Polish & UX):
  - `KeyboardShortcuts.tsx` — Ctrl+Z/Y, Ctrl+S, Ctrl+Shift+S, Delete, Ctrl+D, ↑↓, Escape; skips when typing in inputs
  - `block-templates.ts` — 4 templates: Landing Page, Service Page, About Page, Contact Page
  - `Toast.tsx` — `useToast()` hook + `ToastContainer` component; success/error/info variants; auto-dismiss
  - `Canvas.tsx` — empty state rebuilt with template picker (icon, label, description) + quick-add buttons
  - `index.tsx` — wired KeyboardShortcuts, Toast, beforeunload guard, Payload data load on mount, saveDraft/publish callbacks shared across toolbar and keyboard handler
  - `page-editor-preview/page.tsx` — `BlockWrapper` with `contenteditable` inline editing; double-click text → edit in place → blur/Enter → `INLINE_EDIT_END` postMessage
  - `PreviewIframe.tsx` — handles `INLINE_EDIT_END` → calls `updateBlockData` in store
  - `VisualEditorDocButton.tsx` — "Open Visual Editor" button in Pages document edit view using `useDocumentInfo()`
  - Registered `VisualEditorDocButton` on Pages collection via `admin.components.edit.SaveButton`
- TypeScript: `tsc --noEmit` passes with zero errors
- Phases 1–6 complete. Phase 7 (advanced features) pending.

### 2026-04-03 (session 3) — Phase 7 advanced features
- `Skeleton.tsx` — 4-panel shimmer skeleton matching editor layout; `SkeletonRect` + `SkeletonBlockCard` sub-components
- `ErrorBoundary.tsx` — React class component; shows error message + "Try Again" button that resets state
- `store.ts` — added `isLoading`, `clipboard: BlockInstance | null`, `setLoading()`, `copyBlock()`, `pasteBlock()`, `updateBlockStyles()`; `serializeBlocksForPayload` now includes `_styles`; `deserializeBlocksFromPayload` restores `styles` from `_styles`
- `types.ts` — added `BlockStyles` type (`paddingTop`, `paddingBottom`, `backgroundColor`); added `styles?: BlockStyles` to `BlockInstance`
- `KeyboardShortcuts.tsx` — added Ctrl+C (copyBlock) and Ctrl+V (pasteBlock, only if clipboard non-empty)
- `ConfigPanel.tsx` — added `BlockStylesPanel` collapsible section: padding top/bottom (number inputs, px) and background color (color picker + text input + clear button); wired to `updateBlockStyles`
- `index.tsx` — wired `EditorSkeleton` while `isLoading` is true; wrapped editor core in `ErrorBoundary`; `setLoading(true/false)` around Payload fetch on mount
- TypeScript: `tsc --noEmit` passes with zero errors

### 2026-04-04 (session 3, continued) — Phase 7 completion
- `two-col-block` + `three-col-block` added to block registry (Layout category)
  - 2-col: leftTitle/leftText + rightTitle/rightText + gap select (small/medium/large)
  - 3-col: col1/col2/col3 title+text fields + gap select
- `TwoColBlock.tsx` + `ThreeColBlock.tsx` created in `src/components/blocks/`; CSS Grid layout; `data-field` attrs for inline editing
- `PageBlocksRenderer.tsx` updated with `two_col` and `three_col` cases
- `types.ts`: `PageBuilderBlock` union extended; loose-cast mapper handles new blocks before the Payload-typed switch
- `page-editor-preview/page.tsx`: extended `INLINE_TEXT_FIELDS` with all column field names
- `RevisionHistory.tsx` created: slide-in panel listing last 25 Payload versions; shows date, status (draft/published), auto-save marker; "Restore" button fetches version and loads blocks into editor store; backdrop click to dismiss
- `index.tsx`: 🕓 history button in Toolbar opens RevisionHistory; `useState(showHistory)` + close callback
- TypeScript: `tsc --noEmit` passes with zero errors
- **Phase 7 complete. All visual editor features implemented.**

### 2026-04-04 (session 4) — Phase 8 enhancements
- Completed preview style application (`paddingTop`, `paddingBottom`, `backgroundColor`) in `src/app/page-editor-preview/page.tsx`
- Completed breakpoint visibility rendering using `hiddenOn` + live `responsiveMode` from editor postMessage (`UPDATE_BLOCKS`)
- Added block palette search in `src/payload/views/PageEditor/BlockPalette.tsx`
- Added canvas finder and jump-to-match in `src/payload/views/PageEditor/Canvas.tsx`
- Added `Ctrl+F` shortcut to focus canvas finder in `src/payload/views/PageEditor/KeyboardShortcuts.tsx`
- Added inline page title editor in toolbar and persisted `title` in save draft / publish payloads (`src/payload/views/PageEditor/index.tsx`)
- Extended canvas block cards with lightweight data summary badge
- TypeScript: `tsc --noEmit` passes with zero errors

---

## Update Policy
- Mark tasks complete immediately after finishing them
- Add dated work log entries for each session
- Keep "Active Tasks" section current
- Strike through completed phase headings when all tasks in phase are done
