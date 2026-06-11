# Story Map — Product Planning Document

> **App Name (suggested):** StoryMap  
> **Version:** MVP 1.0  
> **Stack:** React + Vite + TypeScript + Tailwind CSS + React Router + Zustand + localStorage  
> **Author context:** Personal use — no auth, no backend  

---

## 1. Product Summary

StoryMap is a browser-based, offline-first product scope planning tool. It lets product managers, designers, and engineers visually organize the scope of a product using the User Story Mapping technique — a widely used agile practice where user journeys are broken into steps, and stories are grouped under releases to communicate what ships when.

The app has no server, no login, and no collaboration. Everything lives in `localStorage`. It is designed to be fast to open, fast to edit, and easy to read aloud in a planning session.

**Core mental model:**

```
Project
  └── Story Map
        ├── User Journey  (horizontal swim lanes, top row)
        │     └── Steps   (cards under each journey)
        └── Release        (horizontal bands running across all journeys)
              └── Stories  (pink-accented cards under each release)
                    └── Story Details (title, description, attachments, comments)
```

---

## 2. MVP Scope

| # | Feature | Notes |
|---|---------|-------|
| 1 | Project sidebar | Logo, project list, create project button |
| 2 | Create project modal | Name + description, save to store |
| 3 | Project selection | Click project → show its story maps |
| 4 | Story map listing page | Cards with metadata, search, create button |
| 5 | Create story map | Name-only modal; creates empty board |
| 6 | Story map board | Full-screen board canvas with horizontal scroll |
| 7 | Add Journey | Appends a new Journey column |
| 8 | Edit journey title inline | Click to edit, blur/Enter to save |
| 9 | Add Step under Journey | Creates a step card inside the journey column |
| 10 | Edit step title inline | Click to edit, blur/Enter to save |
| 11 | Add Release | Appends a horizontal release band |
| 12 | Add Story under Release | Creates a story card under a release |
| 13 | Open Story Details drawer | Right-side drawer, dims background |
| 14 | Edit story title | Editable in drawer |
| 15 | Add description | Plain textarea (no rich text for MVP) |
| 16 | Add comments | Simple list of text comments with timestamp |
| 17 | Attachment preview | File input → base64 preview in drawer |
| 18 | localStorage persistence | Auto-save on every state change |
| 19 | Search story maps | Filter cards by name on listing page |
| 20 | Three-dot menus | Rename + Delete for journeys, steps, releases, stories, story maps |

---

## 3. Out-of-Scope for MVP

- User authentication / accounts
- Backend / database / API
- Real-time collaboration
- Drag-and-drop reordering (post-MVP)
- Rich text editor (markdown or WYSIWYG for description)
- File upload to cloud storage
- Export to PDF / CSV / Jira
- Story point estimation / velocity
- Epic / Theme grouping above journeys
- Notifications
- Dark mode
- Mobile layout (desktop + laptop only)
- Undo/redo
- Keyboard shortcuts beyond Enter/Escape
- Priority or status flags on stories

---

## 4. User Flow

```
App opens
  │
  ├─ No projects exist
  │     → Show empty sidebar state → "Create Project" button
  │
  └─ Projects exist
        │
        ├─ Click project in sidebar
        │     → Dashboard shows story maps for that project
        │
        ├─ Click "Create Project"
        │     → Open Create Project modal
        │     → Fill name + description → Submit
        │     → Project added to sidebar, auto-selected
        │
        ├─ Click "Create Story Map" on dashboard
        │     → Open Create Story Map modal (name only)
        │     → Map created → navigate to Story Map Board
        │
        ├─ Click a story map card
        │     → Navigate to Story Map Board for that map
        │
        └─ Story Map Board
              │
              ├─ Board is empty
              │     → Empty state UI with "Add Journey" button
              │
              ├─ Click "Add Journey"
              │     → Appends journey column, focus on title input
              │
              ├─ Click journey title
              │     → Inline edit input appears
              │
              ├─ Click "Add Step" under journey
              │     → New step card appears, focus on title
              │
              ├─ Click "Add Release"
              │     → New release band appended at bottom
              │
              ├─ Click "Add Story" inside release
              │     → New story card appears
              │
              └─ Click a story card
                    → Story Details drawer slides in from right
                    → Background dims
                    → Edit title, description, attachments, comments
                    → Click Save or close
```

---

## 5. Page List

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `DashboardPage` | Selected project's story map listing. Redirects to first project or shows "create project" prompt if none. |
| `/board/:mapId` | `BoardPage` | Story map board for a specific map. Full canvas. |

> Only two routes needed for MVP. The sidebar always renders. No nested routing needed beyond these two.

---

## 6. Component List

### Layout
| Component | Purpose |
|-----------|---------|
| `AppShell` | Root layout — sidebar + main content area |
| `Sidebar` | Logo, project list, create project button |
| `ProjectListItem` | Single project row in sidebar |

### Modals
| Component | Purpose |
|-----------|---------|
| `CreateProjectModal` | Name + description form |
| `CreateStoryMapModal` | Name-only form |
| `ConfirmDeleteModal` | Reusable "Are you sure?" dialog |

### Dashboard Page
| Component | Purpose |
|-----------|---------|
| `DashboardPage` | Container: search + header + grid |
| `StoryMapCard` | Card showing map metadata + three-dot menu |
| `StoryMapCardMenu` | Three-dot dropdown for map actions |

### Board Page
| Component | Purpose |
|-----------|---------|
| `BoardPage` | Container, board header, canvas wrapper |
| `BoardHeader` | Back arrow + map title |
| `BoardCanvas` | Horizontally scrollable canvas area |
| `EmptyBoardState` | Empty state illustration + hint text |
| `JourneyColumn` | One vertical column per journey |
| `JourneyHeader` | Journey title (inline-editable) + three-dot + "Add Step" |
| `StepCard` | A single step card (inline-editable title, number badge) |
| `ReleaseSection` | Horizontal band spanning all journeys |
| `ReleaseHeader` | Release name (inline-editable) + story count + three-dot |
| `StoryCard` | A single story card with pink top border |
| `AddJourneyButton` | Persistent button in board header |
| `AddReleaseButton` | Dotted pink line with "+ Add Release" label |

### Story Details Drawer
| Component | Purpose |
|-----------|---------|
| `StoryDrawer` | Root drawer shell, overlay, slide animation |
| `StoryTitleInput` | Editable story title at top |
| `AttachmentUploader` | File input + base64 preview thumbnails |
| `DescriptionEditor` | Simple `<textarea>` for description |
| `CommentSection` | Comment input + comment list |
| `CommentItem` | Single comment with timestamp |

### Shared / Utility
| Component | Purpose |
|-----------|---------|
| `ThreeDotMenu` | Reusable dropdown trigger + menu |
| `InlineEditInput` | Input shown in place of text on click |
| `Modal` | Reusable modal wrapper (backdrop + card) |
| `Button` | Styled button with variants: primary, ghost, danger |
| `Badge` | Small count badge (for story count, etc.) |
| `EmptyState` | Centered empty state with icon and text |

---

## 7. Folder Structure

```
src/
├── main.tsx                    # Vite entry point
├── App.tsx                     # Router + AppShell
│
├── pages/
│   ├── DashboardPage.tsx
│   └── BoardPage.tsx
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   └── ProjectListItem.tsx
│   │
│   ├── modals/
│   │   ├── CreateProjectModal.tsx
│   │   ├── CreateStoryMapModal.tsx
│   │   └── ConfirmDeleteModal.tsx
│   │
│   ├── dashboard/
│   │   ├── StoryMapCard.tsx
│   │   └── StoryMapCardMenu.tsx
│   │
│   ├── board/
│   │   ├── BoardHeader.tsx
│   │   ├── BoardCanvas.tsx
│   │   ├── EmptyBoardState.tsx
│   │   ├── JourneyColumn.tsx
│   │   ├── JourneyHeader.tsx
│   │   ├── StepCard.tsx
│   │   ├── ReleaseSection.tsx
│   │   ├── ReleaseHeader.tsx
│   │   ├── StoryCard.tsx
│   │   ├── AddJourneyButton.tsx
│   │   └── AddReleaseButton.tsx
│   │
│   ├── drawer/
│   │   ├── StoryDrawer.tsx
│   │   ├── StoryTitleInput.tsx
│   │   ├── AttachmentUploader.tsx
│   │   ├── DescriptionEditor.tsx
│   │   ├── CommentSection.tsx
│   │   └── CommentItem.tsx
│   │
│   └── shared/
│       ├── ThreeDotMenu.tsx
│       ├── InlineEditInput.tsx
│       ├── Modal.tsx
│       ├── Button.tsx
│       ├── Badge.tsx
│       └── EmptyState.tsx
│
├── store/
│   ├── useAppStore.ts          # Root Zustand store (combines slices)
│   ├── projectSlice.ts         # Project CRUD
│   ├── storyMapSlice.ts        # StoryMap CRUD
│   ├── boardSlice.ts           # Journeys, Steps, Releases, Stories
│   └── uiSlice.ts              # Modal open states, active drawer story, selected project
│
├── types/
│   └── index.ts                # All TypeScript interfaces
│
├── lib/
│   ├── storage.ts              # localStorage read/write helpers
│   ├── idgen.ts                # nanoid or crypto.randomUUID wrapper
│   └── dateFormat.ts           # Consistent date formatting
│
├── hooks/
│   ├── useInlineEdit.ts        # Shared hook for inline editing logic
│   └── useClickOutside.ts      # Detect click outside an element
│
└── styles/
    └── index.css               # Tailwind base + custom CSS vars
```

---

## 8. Data Model / Interface Structure

```typescript
// types/index.ts

// ─── Core Entities ───────────────────────────────────────────────

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;       // ISO date string
}

interface StoryMap {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
  createdBy: string;       // hardcoded "You" for MVP (no auth)
}

interface Journey {
  id: string;
  mapId: string;
  title: string;
  order: number;           // for display ordering
}

interface Step {
  id: string;
  journeyId: string;
  mapId: string;
  title: string;
  order: number;           // within the journey
  // Display number like "1.0" is derived: journeyIndex.stepOrder
}

interface Release {
  id: string;
  mapId: string;
  name: string;
  order: number;
}

interface Story {
  id: string;
  releaseId: string;
  mapId: string;
  title: string;
  description: string;
  order: number;
  attachments: Attachment[];
  comments: Comment[];
  createdAt: string;
}

interface Attachment {
  id: string;
  name: string;
  type: string;            // MIME type e.g. "image/png"
  dataUrl: string;         // base64 data URL for preview
  uploadedAt: string;
}

interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

// ─── localStorage Root Shape ─────────────────────────────────────

interface AppData {
  projects: Project[];
  storyMaps: StoryMap[];
  journeys: Journey[];
  steps: Step[];
  releases: Release[];
  stories: Story[];
}

// ─── UI State (not persisted) ────────────────────────────────────

interface UIState {
  selectedProjectId: string | null;
  activeStoryId: string | null;      // drives the drawer
  isCreateProjectModalOpen: boolean;
  isCreateStoryMapModalOpen: boolean;
  isConfirmDeleteModalOpen: boolean;
  confirmDeleteTarget: DeleteTarget | null;
}

interface DeleteTarget {
  type: 'project' | 'storyMap' | 'journey' | 'step' | 'release' | 'story';
  id: string;
  label: string;           // shown in modal: "Delete Journey 'Onboarding'?"
}
```

**Key design decisions in the data model:**

- **Flat arrays, not nested objects.** Every entity is stored in its own top-level array. Relations are by `id` reference. This makes localStorage serialization trivial and avoids deeply nested mutation pain in Zustand.
- **`order` field on everything orderable.** This is the sort key. No drag-and-drop in MVP, but the field is there for v2.
- **`mapId` denormalized on Steps and Stories.** Makes it easy to query "all steps for map X" without joining through journeys/releases.
- **Base64 attachments.** Not ideal for large files but works for MVP without a server. Limited to reasonable file sizes (warn/cap at 2MB per file).
- **No rich text for description.** Plain `string`. Post-MVP can swap in a Tiptap/Slate editor.

---

## 9. State Management Plan (Zustand)

### Store architecture: Single store with logical slice sections

Use one Zustand store (`useAppStore`) that is composed from slice creators. This avoids the complexity of multiple stores while keeping each slice's logic isolated.

```typescript
// store/useAppStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createProjectSlice } from './projectSlice';
import { createStoryMapSlice } from './storyMapSlice';
import { createBoardSlice } from './boardSlice';
import { createUISlice } from './uiSlice';

export const useAppStore = create(
  persist(
    (...args) => ({
      ...createProjectSlice(...args),
      ...createStoryMapSlice(...args),
      ...createBoardSlice(...args),
      ...createUISlice(...args),   // UI state excluded from persist (see §10)
    }),
    { name: 'storymap-data' }
  )
);
```

### Slice responsibilities

**`projectSlice`**
- `projects: Project[]`
- `addProject(name, description)`
- `updateProject(id, patch)`
- `deleteProject(id)` → also cascades delete of all maps/journeys/steps/releases/stories for that project

**`storyMapSlice`**
- `storyMaps: StoryMap[]`
- `addStoryMap(projectId, name)`
- `updateStoryMap(id, patch)`
- `deleteStoryMap(id)` → cascades delete of all board data for that map
- `getStoryMapsForProject(projectId)` → derived selector

**`boardSlice`**
- `journeys: Journey[]`
- `steps: Step[]`
- `releases: Release[]`
- `stories: Story[]`
- `addJourney(mapId)` → creates with default title "New Journey"
- `updateJourney(id, patch)`
- `deleteJourney(id)` → also deletes its steps
- `addStep(journeyId, mapId)`
- `updateStep(id, patch)`
- `deleteStep(id)`
- `addRelease(mapId)`
- `updateRelease(id, patch)`
- `deleteRelease(id)` → also deletes its stories
- `addStory(releaseId, mapId)`
- `updateStory(id, patch)` → used for title, description, attachments, comments
- `deleteStory(id)`
- `addComment(storyId, text)`
- `addAttachment(storyId, attachment)`
- `deleteAttachment(storyId, attachmentId)`

**`uiSlice`** *(not persisted)*
- `selectedProjectId`
- `activeStoryId` (open drawer)
- `isCreateProjectModalOpen`
- `isCreateStoryMapModalOpen`
- `confirmDeleteTarget`
- `setSelectedProject(id)`
- `openStoryDrawer(id)`
- `closeStoryDrawer()`
- `openCreateProjectModal()` / `closeCreateProjectModal()`
- `openCreateStoryMapModal()` / `closeCreateStoryMapModal()`
- `setConfirmDeleteTarget(target)` / `clearConfirmDeleteTarget()`

### Derived/selector patterns (no extra library needed)

Compute derived data inside components using `useAppStore` selectors:

```typescript
// Example: get computed counts for a story map card
const journeyCount  = journeys.filter(j => j.mapId === map.id).length;
const stepCount     = steps.filter(s => s.mapId === map.id).length;
const releaseCount  = releases.filter(r => r.mapId === map.id).length;
const storyCount    = stories.filter(s => s.mapId === map.id).length;
```

These are cheap at MVP scale (dozens of records). No memoization needed yet.

---

## 10. localStorage Persistence Plan

### Strategy: Zustand `persist` middleware (automatic)

The `persist` middleware from Zustand handles all serialization automatically. On every state change, it serializes the store to `localStorage` under the key `storymap-data`.

### What is persisted

```
localStorage key: "storymap-data"
Value: JSON object containing:
  - projects[]
  - storyMaps[]
  - journeys[]
  - steps[]
  - releases[]
  - stories[]           ← includes attachments as base64 + comments
```

### What is NOT persisted

`uiSlice` state:
- `selectedProjectId` — will auto-select first project on load
- `activeStoryId` — drawer always starts closed
- All modal open states — always start closed

Exclude UI state from persistence by using Zustand's `partialize` option:

```typescript
persist(storeCreator, {
  name: 'storymap-data',
  partialize: (state) => ({
    projects: state.projects,
    storyMaps: state.storyMaps,
    journeys: state.journeys,
    steps: state.steps,
    releases: state.releases,
    stories: state.stories,
  }),
})
```

### Storage size considerations

- Base64 images are ~1.33× the raw file size.
- localStorage limit is ~5MB per origin.
- If users attach many images, they could hit the limit.
- **Mitigation:** Warn user if attachment is >1MB. Show a soft warning if total storage approaches 4MB. Do not block the app — just warn.

### Migration / versioning

Add a `version: number` field to the persisted data. If version mismatch is detected on load, run a migration function. For MVP, version = `1`. Document the pattern so it's ready when the schema changes.

---

## 11. UI Behavior Rules

### Inline editing (journeys, steps, releases, stories)
- Text renders as normal text by default.
- Clicking text → replaces with `<input>` or `<textarea>` focused and text selected.
- Press `Enter` or blur → save.
- Press `Escape` → cancel, revert to previous value.
- Empty submit → revert to previous value (do not save empty string).
- Input width matches the text container width (no layout shift).

### Modals
- Backdrop click → close modal (do not save).
- `Escape` key → close modal.
- Submit button is disabled if required fields are empty.
- After submit, modal closes and newly created item is visible/selected.

### Story Details Drawer
- Opens from the right, slides in over a dimmed backdrop.
- Backdrop click → close drawer (prompt save if dirty — simple flag check).
- Drawer width: 480px on desktop.
- Changes are not auto-saved on every keystroke. User must click "Save" button.
- After Save: show a brief "Saved" toast/indicator near the button (no library needed — just a CSS transition on a state flag).
- Fields: story title (top, large), description (textarea below), attachments (file input section), comments (at bottom).

### Story map board canvas
- Horizontally scrollable when content exceeds viewport.
- Journey columns have a fixed minimum width (e.g., 220px) and grow to fill.
- Steps are stacked vertically within their journey column.
- Releases span the full width of all journey columns.
- "Add Journey" button is always visible in the board header (not scrolled away).
- "Add Release" button is below the last release, always accessible by scrolling down.
- New journeys and releases get generic default names ("New Journey", "Release 1") that can be immediately edited.

### Three-dot menus
- Open on click, close on click-outside or Escape.
- Available actions per entity:
  - Journey: Rename, Delete
  - Step: Rename, Delete
  - Release: Rename, Delete
  - Story: Delete
  - Story Map (on dashboard card): Rename, Delete
- "Delete" opens the `ConfirmDeleteModal` before executing.
- "Rename" triggers inline edit mode (same as clicking the title).

### Step numbering
- Step number badge is derived: `{journeyIndex + 1}.{stepOrder}`
- Example: Journey 1, Step 0 → "1.0"; Journey 1, Step 1 → "1.1"; Journey 2, Step 0 → "2.0"
- Numbers update automatically when journeys or steps are added/removed.

### Empty states
- Dashboard with no story maps for selected project: show centered empty state with "No story maps yet. Create your first one."
- Board with no journeys: show "Let's get started..." empty state.
- No sidebar projects: show "Create a project to get started."

### Search (dashboard)
- Controlled input, filters `storyMaps` by `name.toLowerCase().includes(query)`.
- Filters in real-time (no debounce needed for MVP scale).
- If no results: show "No story maps match your search."

### Attachment upload
- Accept: `image/*,application/pdf,.doc,.docx,.txt`
- On file select: read as base64 data URL using `FileReader`.
- Show preview thumbnail for images, file icon + name for non-images.
- Delete attachment button (×) on each preview.
- Max file size: warn at 1MB (do not block).

### Comments
- Comment input is a single-line text input with a "Post" button (or Enter to submit).
- Comments are displayed newest-first.
- Timestamp shown as relative ("2 hours ago") or absolute date string.
- No editing or deleting comments in MVP.

---

## 12. Step-by-Step Implementation Plan

### Phase 1 — Project scaffold & infrastructure

**Step 1: Initialize project**
- `npm create vite@latest storymap -- --template react-ts`
- Install: `tailwindcss`, `react-router-dom`, `zustand`, `nanoid`
- Configure Tailwind with custom colors (blue-purple primary, pink accent)
- Set up `index.css` with CSS variables

**Step 2: Define all TypeScript types**
- Create `src/types/index.ts` with all interfaces exactly as in §8
- This becomes the source of truth for everything else

**Step 3: Build utility helpers**
- `lib/idgen.ts` — `crypto.randomUUID()` wrapper
- `lib/dateFormat.ts` — format ISO date to "Jun 10, 2026"
- `lib/storage.ts` — manual backup methods (optional, since persist handles it)

**Step 4: Build Zustand store**
- Create all four slices: project, storyMap, board, ui
- Wire with `persist` middleware
- Test in browser console that data survives a page refresh

---

### Phase 2 — Shared components

**Step 5: Build shared primitives**
- `Button` component (primary/ghost/danger variants)
- `Modal` wrapper (backdrop, card, close icon)
- `InlineEditInput` hook + component
- `ThreeDotMenu` component
- `Badge` component
- `EmptyState` component

---

### Phase 3 — Layout & Sidebar

**Step 6: App shell + routing**
- `App.tsx` with `BrowserRouter`, two routes: `/` and `/board/:mapId`
- `AppShell` with sidebar (fixed left) + main content area (scrollable)

**Step 7: Sidebar**
- Logo area (text logo for MVP)
- "Create Project" button → opens modal
- Project list (click to select → updates `selectedProjectId` in uiSlice)
- Active project highlighted
- Empty sidebar state

**Step 8: Create Project modal**
- Name input (required) + description textarea
- On submit: `addProject()`, close modal, select new project

---

### Phase 4 — Dashboard

**Step 9: Dashboard page**
- Search input (controlled, filters maps)
- "Create Story Map" button → opens modal
- Story map card grid (responsive, 3-col on wide, 2-col on medium)

**Step 10: Story map card**
- Name, counts (journeys, steps, releases, stories), createdBy, date
- Three-dot menu: Rename, Delete

**Step 11: Create Story Map modal**
- Name input only
- On submit: `addStoryMap(selectedProjectId, name)`, navigate to `/board/:newMapId`

---

### Phase 5 — Board core

**Step 12: Board page shell**
- Board header: back arrow (navigate `/`), map name
- Board canvas wrapper (horizontal scroll container)
- Empty board state

**Step 13: Add Journey**
- "Add Journey" button in header
- `addJourney(mapId)` → renders new `JourneyColumn`
- Auto-focus journey title for immediate editing

**Step 14: Journey column + header**
- Journey title (inline-editable)
- Three-dot menu (rename, delete)
- "Add Step" button at bottom of column

**Step 15: Step cards**
- Card with number badge (derived) and inline-editable title
- Three-dot menu (rename, delete)
- Cards stack vertically within the journey column

---

### Phase 6 — Releases & Stories

**Step 16: Release section**
- "Add Release" button with dotted pink horizontal line
- `ReleaseSection` renders below all journey content
- Spans full width of board

**Step 17: Release header**
- Inline-editable release name
- Story count badge
- Three-dot menu (rename, delete)

**Step 18: Story cards**
- Pink top border
- Inline-editable title (or click to open drawer)
- "Add Story" button inside release band
- Three-dot menu (delete)

---

### Phase 7 — Story Details Drawer

**Step 19: Drawer shell**
- Slide-in from right, 480px wide
- Dimmed backdrop (semi-transparent overlay)
- Close button (×) top-right
- "Story details" header text

**Step 20: Story title input**
- Large editable heading inside drawer

**Step 21: Description editor**
- Simple `<textarea>` with auto-grow (CSS `field-sizing: content` or JS resize)

**Step 22: Attachment uploader**
- File input button
- Image preview thumbnails (show filename + × delete button)

**Step 23: Comments**
- Text input + "Post" button
- Comment list (newest first) with timestamp

**Step 24: Save button**
- Fixed bottom-right of drawer
- On click: `updateStory(id, { title, description })` (attachments + comments are saved immediately on action)
- Show "Saved ✓" flash for 1.5 seconds

---

### Phase 8 — Polish & edge cases

**Step 25: Three-dot menus + ConfirmDeleteModal**
- Wire all three-dot menus to actions
- Confirm delete modal for all destructive actions
- Cascade deletes work correctly

**Step 26: Search**
- Wire search input on dashboard
- Empty search results state

**Step 27: Storage warning**
- Check `localStorage` usage after each story save
- If >4MB, show inline warning: "Storage is nearly full. Consider removing large attachments."

**Step 28: Final QA pass**
- Verify all localStorage data survives refresh
- Verify all cascade deletes clean up orphaned records
- Verify board horizontal scroll works
- Verify drawer overlay + close behavior
- Check empty states on all pages

---

## 13. Suggested Development Order

```
Week 1 (foundation)
  ├── Day 1: Scaffold, Tailwind config, types, idgen, dateFormat
  ├── Day 2: Zustand store (all slices + persist)
  ├── Day 3: Shared primitives (Button, Modal, Badge, InlineEditInput, ThreeDotMenu)
  └── Day 4: AppShell + Sidebar + CreateProjectModal

Week 2 (dashboard + board)
  ├── Day 5: Dashboard page + StoryMapCard + CreateStoryMapModal
  ├── Day 6: Board page shell + BoardHeader + EmptyBoardState
  ├── Day 7: JourneyColumn + JourneyHeader + inline edit + "Add Journey"
  └── Day 8: StepCards + step numbering

Week 3 (releases + drawer)
  ├── Day 9:  ReleaseSection + ReleaseHeader + "Add Release"
  ├── Day 10: StoryCard + "Add Story"
  ├── Day 11: StoryDrawer shell + StoryTitle + DescriptionEditor
  └── Day 12: AttachmentUploader + CommentSection

Week 4 (polish)
  ├── Day 13: All three-dot menus + ConfirmDeleteModal + cascade deletes
  ├── Day 14: Search, empty states, storage warning
  └── Day 15: QA, bug fixes, final CSS polish
```

> At day 4, you have a working sidebar + project creation = already usable.
> At day 8, the core board is usable for planning.
> Day 12 completes all MVP features.
> Days 13–15 are hardening.

---

## 14. Risks and Things to Avoid

### Data / Storage Risks

| Risk | Mitigation |
|------|-----------|
| localStorage 5MB limit hit by base64 images | Warn at 1MB per file; show storage indicator; note the limit in UI |
| Orphaned data on cascade delete | Write `deleteProject`, `deleteStoryMap`, `deleteJourney`, `deleteRelease` to explicitly clean child arrays |
| Schema change breaks existing stored data | Add `version` field; write a `migrate()` function before the store hydrates |
| User accidentally deletes a project | Always use ConfirmDeleteModal for destructive actions — never delete on first click |

### Implementation Risks

| Risk | Mitigation |
|------|-----------|
| Deeply nested Zustand mutations get messy | Keep data flat (arrays, not nested objects). Never nest stories inside releases inside the store object |
| Board layout breaks with many journeys | Use `min-width` on columns + `overflow-x: auto` on canvas container. Test with 10+ journeys |
| Inline editing steals focus unexpectedly | Use `useClickOutside` hook carefully; don't auto-focus on every render |
| Three-dot menu z-index conflicts | Give menus a high z-index (e.g. `z-50`) and ensure drawer/modal have even higher (`z-100`) |
| Drawer state out of sync with store | Never store drawer form state separately from the store. Read directly from the story object; only buffer changes locally until Save is clicked |
| Component sprawl | Resist creating sub-components until a component is genuinely reused or exceeds ~200 lines |

### Design Risks

| Risk | Mitigation |
|------|-----------|
| Board becomes unreadable with lots of content | Journeys fixed min-width, steps show truncated title with `text-ellipsis`, releases use max-height with scroll |
| Over-engineering the UI too early | Ship plain HTML/Tailwind first. Add animations (drawer slide, toast) only after core logic works |
| Inconsistent spacing/colors | Define Tailwind config tokens once (`primary`, `accent-pink`, etc.) and never use raw hex values |

### Things to Explicitly Avoid

1. **Do not use nested objects in the Zustand store** (stories inside releases inside maps). Flat arrays only.
2. **Do not use a rich text editor in MVP.** A `<textarea>` is sufficient and avoids a complex dependency.
3. **Do not implement drag-and-drop in MVP.** It adds significant complexity for marginal MVP value.
4. **Do not debounce auto-save.** The Zustand persist middleware handles this automatically and efficiently.
5. **Do not use `any` types in TypeScript.** The interfaces are defined — use them.
6. **Do not render all story data on the board.** The board shows titles only. Full story data loads only when the drawer opens.
7. **Do not add a router guard or redirect logic until at least one project exists.** Let the sidebar handle the empty state instead.
8. **Do not use external component libraries (MUI, Chakra, etc.).** Tailwind + custom components keeps the bundle tiny and the design fully under control.

---

*Document version: 1.0 — ready for implementation.*
