# StoryMap — Project Handoff Document

> Self-contained handoff for continuing the StoryMap project in a new chat/session. Assumes zero prior context. Generated 2026-06-10.

---

## 1. Purpose & Goal

**Overall purpose:** Build **StoryMap**, a browser-based, offline-first **User Story Mapping** tool for product planning. A single user (no auth, no backend) visually organizes a product's scope: Projects contain Story Maps; a Story Map board has User Journeys (with Steps) and Releases (with Stories); each Story has a details drawer (description, attachments, comments). Everything persists in `localStorage`.

**Current objective:** The MVP is built and functional. Recent work has been **UI/theming and polish**, in this order over the session:
1. Migrated the entire UI from Tailwind CSS to **MUI (Material UI v9)** with a centralized theme.
2. Re-themed the MUI theme to exactly match a **Figma "Minimal_Web" (Minimals) design system** (extracted real tokens via Figma MCP).
3. Built a **standalone `/login` page** (visual recreation of the Minimals Amplify sign-in) with a background video and "liquid glass" card.
4. Replaced the app logo with the user's **"Software Co" SVG logos** (black + white variants).
5. Various layout tweaks (search bar, 2×2 journeys grid on the board, 2×2 stats inside dashboard cards, 4-cards-per-row dashboard grid, vertical 320px-wide stories).

The app currently **builds cleanly** (`npm run build` passes) and runs via Vite dev server. There is **no pending task** — the last actions were small UI adjustments, all complete.

---

## 2. Background & Context

- **Working directory:** `D:\Storymap` (Windows 11, PowerShell default shell; Bash also available). Not a git repo.
- **Stack:** React 18 + Vite 5 + TypeScript 5 (strict, `noUnusedLocals`/`noUnusedParameters` on) + React Router 6 + Zustand 4 (with `persist`) + MUI v9 + Emotion 11. Public Sans font via `@fontsource/public-sans`.
- **Tailwind has been fully removed** (no `tailwind.config.js`, no `postcss.config.js`, deps uninstalled). All styling is MUI theme + `sx`.
- **Two persisted Zustand stores:**
  - `useProjectStore` → localStorage key **`storymap-data`** (projects, storyMaps, selectedProjectId).
  - `useBoardStore` → localStorage key **`storymap-board`** (journeys, steps, releases, stories).
  - Both have `version: 1` + a `migrate` passthrough.
- **Data model is flat arrays**, relations by id (never nested objects) — a hard rule from the original plan. Story counts on dashboard cards are **derived** from the board store, not stored.
- **Constraints repeatedly enforced by the user:** Do NOT rebuild the app, change functionality/business logic, change Zustand/localStorage logic, change routing (except where a new feature genuinely requires it, e.g. the `/login` route), change data models, or add a real backend/auth. UI/theme/presentation changes only. Use Figma as the single source of truth for styling; do not guess colors/spacing/shadows.
- **Build/verify loop:** After every change run `npm run build` (which runs `tsc -b && vite build`) and confirm it passes before reporting. The Vite dev server runs in the background on **http://localhost:5173/**; it is NOT permanent and has needed restarting (`npm run dev`) when the background process died.
- **Reference Figma file:** `https://www.figma.com/design/RJJDzj9SvaQG43EYkNMa0o/Minimal_Web` (file key `RJJDzj9SvaQG43EYkNMa0o`). It is the **Minimals** MUI admin template design system. Tokens were extracted via the Figma MCP `get_variable_defs` on these nodes: Colors `0:2627`, Typography `399:52624`, Shadows `0:2407`, and the search field component `5796:133417`.
- **Login page reference:** `https://minimals.cc/auth/amplify/sign-in` (client-rendered; recreated from knowledge of the Minimals layout).
- **Original planning doc** at `D:\Storymap\STORY_MAP_PLANNING.md` (the product spec the app was built from). Still exists.

---

## 3. About the User

- **Builds iteratively and visually.** Gives short, direct, incremental UI instructions (often a sentence or a screenshot), reviews the result, then refines. Sometimes reverses a previous instruction after seeing it.
- **Communicates casually/informally**, sometimes with minor typos. Interpret intent generously; confirm understanding when ambiguous, but keep moving.
- **Prefers concise responses** that state what changed, which files, and how to see it — not long essays. Wants honesty about limitations (e.g., when an exact asset couldn't be reproduced).
- **Cares about pixel-level fidelity** to references (Figma, Minimals) and exact assets — when offered a recreation vs. their real SVG, they provided the real SVG and said "don't change the logo use the same SVG."
- **Expects the full loop handled**: make the change, build it, restart the dev server if needed, give the URL.
- Tone to carry over: friendly, brief, practical, lead with the result.

---

## 4. Decisions Made

1. **Migrate Tailwind → MUI via API-preserving wrappers.** Shared components (`Button`, `Input`, `Textarea`, `Modal`, `Card`, `Badge`, `EmptyState`, `ThreeDotMenu`, `InlineEditInput`) kept their original prop APIs but render MUI internally, so ~20 call sites needed no logic changes.
2. **Tailwind fully removed at the end** (user chose "Remove fully").
3. **Figma "Minimal_Web" is the single source of truth for theme.** This made **primary = green `#00AB55`** and **secondary = blue `#3366FF`**, replacing the earlier indigo/pink. The old "pink accent" for releases/stories became **secondary blue** (Figma has no pink). Most visible intentional change.
4. **Font = Public Sans** via `@fontsource/public-sans` (the Minimals font). Inter removed.
5. **Light-mode semantic tokens derived from the extracted Grey scale** (Figma doc frames were dark-mode): text.primary=Grey800, secondary=Grey600, disabled=Grey500, divider=Grey500@20%, app bg=Grey100, paper=white.
6. **Shadows:** geometry from Figma effects, colored with the Grey/500 channel (`145,158,171`). `customShadows` added via TS module augmentation (`theme.customShadows.{z1,z8,z16,card,dialog,dropdown,primary,...}`).
7. **MUI v9 API specifics learned:** color-specific Button slots (`containedPrimary`) removed → use `variants` API; `PaperProps` → `slotProps.paper`; `Stack`'s `alignItems` shorthand prop errored → put alignment in `sx`. Badge `sx` merge must use array form.
8. **Login page = standalone `/login` route, form-only (no hero panel), no auth gate.** Submitting "Sign in" just `navigate('/')`. App still opens directly to the dashboard. No store/guard changes. Route placed **outside** `AppLayout` so it has no sidebar.
9. **Login visuals:** dark `#011022` base, full-screen background `<video src="/waves.mp4">` (user-provided 8MB file at `public/waves.mp4`), **liquid-glass card** (`rgba(255,255,255,0.25)`, `blur(10px) saturate(180%) brightness(1.08)`, bright rim, inset specular highlight). Form text/inputs are **white/light**. "Get started" link is **light pink `#FFB6C1`**. "Sign in" button is **white** with dark text. "Forgot password?" link sits **below** the password field with **no underline**.
10. **Video-glitch fix:** `backdrop-filter` over the playing video froze when the cursor was idle (Chromium throttles the blurred snapshot). Fixed by (a) isolating the video on its own GPU layer (`transform: translateZ(0); will-change: transform; pointer-events: none`) and (b) an imperceptible perpetual keyframe animation on the card nudging blur 10px↔10.5px.
11. **Logo = user's exact SVGs.** `Group 4.svg` (white text) → `public/logo-white.svg`; `Group 5.svg` (black text) → `public/logo-black.svg` (verified by glyph fills). `Logo` component renders them via `<img>` with a `variant` prop ('black' for the white sidebar, 'white' for the dark login card). Each SVG ~1.4MB. Logo height: sidebar **22px**, login **30px**.
12. **Search field** = reusable `SearchInput` matching Figma node `5796:133417`: outlined, 8px radius, border `rgba(145,158,171,0.32)`, leading 24px `SearchRounded` icon (`text.disabled`), 16px text, grey placeholder.
13. **Board layout = journeys in a 2-column grid** (2×2 for four journeys), capped at `maxWidth: 760`, with the "+ Add Journey" tile as a grid cell. Replaced the old horizontal-scroll row. Releases/stories sit below.
14. **Stories within a release = vertical stack, fixed 320px wide** (left-aligned), not a horizontal grid.
15. **Dashboard:** story-map cards grid is responsive **1→2→3→4 columns** (`xs/sm/md/lg`). Inside each card, the four stats are a **2×2 grid** (Journeys/Steps on top, Releases/Stories below).
16. **Cascade deletes + ConfirmDeleteModal:** all deletes route through `projectStore.confirmDeleteTarget` → `ConfirmDeleteModal` dispatches the right store action; deleting a project/map cascades board rows across stores via `boardStore.deleteMapData`.
17. **Inline editing** via a single `InlineEditInput` (forwardRef exposing `beginEdit()` so three-dot "Rename" can trigger it).

---

## 5. Current State

- **App builds and runs.** `npm run build` passes. Dev server at **http://localhost:5173/** (restart with `npm run dev` if down).
- **Routes:** `/login` (standalone), `/` (DashboardPage, inside AppLayout), `/board/:mapId` (StoryMapBoardPage, inside AppLayout).
- **Theme:** green/blue Minimals palette, Public Sans, 8px base radius (16 for cards/dialogs), Minimal shadows, full component overrides. App background `grey.100` (#F9FAFB), white cards.
- **Login page:** dark `#011022`, waves video background, liquid-glass card, white form, white "Sign in" button, pink "Get started", "Forgot password?" below password (no underline). Video-glitch fix in place.
- **Sidebar:** "Software Co" black logo (height 22), Projects list (MUI List, selected = green), "+ Create Project" button, per-project three-dot Delete.
- **Dashboard:** Header (project name + description), `SearchInput`, "+ Create Story Map" button, "Story Maps" section, responsive 1–4 column card grid. Cards show 2×2 stats + creator avatar + date + three-dot (Rename/Delete).
- **Board:** Header with inline-editable map title + Back + "+ Add Journey". White container holds a **2-column journeys grid** (each journey: green header, stacked steps with `1.0/1.1` derived numbers, "+ Add Step"); below it the Releases panel (dashed "+ Add Release" line, stacked release bands each with a **vertical 320px story column** + "+ Add Story"). Clicking a story opens the right-side `StoryDrawer`.
- **StoryDrawer:** title (instant inline save), attachments (base64, size/storage warnings), description (buffered, Save button + dirty-check on close), comments (relative timestamps).
- **Known dead code:** `hooks/useEscapeKey.ts` and `hooks/useClickOutside.ts` exist but are unused (Modal→Dialog and ThreeDotMenu→MUI Menu handle these internally). Harmless.
- **`public/` assets:** `waves.mp4` (~8MB), `logo-white.svg` (~1.4MB), `logo-black.svg` (~1.4MB) — binary/large, NOT reproduced as text below; must be carried over as files. Sources: video from `C:\Users\gaura\Downloads\waves.bn1dM62f.mp4`; logos from `Group 4.svg` (white) and `Group 5.svg` (black).

---

## 6. Artifacts & Deliverables (full source, verbatim)

> The three `public/` assets (`waves.mp4`, `logo-white.svg`, `logo-black.svg`) are binary/large and must be copied over as files — they cannot be reproduced as text.

### `package.json`
```json
{
  "name": "storymap",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@fontsource/public-sans": "^5.2.7",
    "@mui/icons-material": "^9.1.0",
    "@mui/material": "^9.1.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "zustand": "^4.5.5"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.4",
    "vite": "^5.4.6"
  }
}
```

### `vite.config.ts`
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### `tsconfig.node.json`
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "emitDeclarationOnly": true,
    "declaration": true,
    "outDir": "./node_modules/.tmp/tsnode"
  },
  "include": ["vite.config.ts"]
}
```

### `index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>StoryMap</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `.gitignore`
```
node_modules
dist
dist-ssr
*.local
.DS_Store
.vscode/*
!.vscode/extensions.json
```

### `src/vite-env.d.ts`
```ts
/// <reference types="vite/client" />
```

### `src/main.tsx`
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';
import '@fontsource/public-sans/800.css';
import App from './App';
import { theme } from './theme';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
```

### `src/App.tsx`
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { StoryMapBoardPage } from './pages/StoryMapBoardPage';
import { LoginPage } from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone auth page — rendered without the app shell. */}
        <Route path="/login" element={<LoginPage />} />

        {/* All app pages render inside the AppLayout shell (sidebar + content). */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/board/:mapId" element={<StoryMapBoardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### `src/styles/index.css`
```css
/* Global resets not covered by MUI CssBaseline.
   Colors, fonts, scrollbars, and backgrounds come from the MUI theme. */
html,
body,
#root {
  height: 100%;
}
```

### `src/theme/index.ts`
```ts
import { createTheme, alpha, type Shadows } from '@mui/material/styles';

// ─── Centralized MUI theme — extracted from the Figma "Minimal_Web" design
// system (file RJJDzj9SvaQG43EYkNMa0o). All values below are taken from the
// Figma variables/tokens, not guessed. ────────────────────────────────────

// Grey scale (Figma: Grey/100…900)
const GREY = {
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

// Channel used by Minimal shadows + transparencies (Grey/500 = #919EAB)
const GREY_CH = '145, 158, 171';

const PRIMARY = {
  lighter: '#C8FACD',
  light: '#5BE584',
  main: '#00AB55',
  dark: '#007B55',
  darker: '#005249',
  contrastText: '#FFFFFF',
};

const SECONDARY = {
  lighter: '#D6E4FF',
  light: '#84A9FF',
  main: '#3366FF',
  dark: '#1939B7',
  darker: '#091A7A',
  contrastText: '#FFFFFF',
};

const INFO = {
  lighter: '#CAFDF5',
  light: '#61F3F3',
  main: '#00B8D9',
  dark: '#006C9C',
  darker: '#003768',
  contrastText: '#FFFFFF',
};

const SUCCESS = {
  lighter: '#D8FBDE',
  light: '#86E8AB',
  main: '#36B37E',
  dark: '#1B806A',
  darker: '#0A5554',
  contrastText: '#FFFFFF',
};

const WARNING = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: GREY[800],
};

const ERROR = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
};

// Minimal light-mode shadows (geometry from Figma Shadows/*, colored with the
// Grey/500 channel + the alphas read from the same effects).
export const customShadows = {
  z1: `0 1px 2px 0 rgba(${GREY_CH}, 0.16)`,
  z8: `0 8px 16px 0 rgba(${GREY_CH}, 0.16)`,
  z12: `0 12px 24px -4px rgba(${GREY_CH}, 0.16)`,
  z16: `0 16px 32px -4px rgba(${GREY_CH}, 0.16)`,
  z24: `0 24px 48px 0 rgba(${GREY_CH}, 0.16)`,
  card: `0 0 2px 0 rgba(${GREY_CH}, 0.2), 0 12px 24px -4px rgba(${GREY_CH}, 0.12)`,
  dialog: `-40px 40px 80px -8px rgba(${GREY_CH}, 0.24)`,
  dropdown: `0 0 2px 0 rgba(${GREY_CH}, 0.24), -20px 20px 40px -4px rgba(${GREY_CH}, 0.24)`,
  primary: `0 8px 16px 0 ${alpha(PRIMARY.main, 0.24)}`,
  secondary: `0 8px 16px 0 ${alpha(SECONDARY.main, 0.24)}`,
  error: `0 8px 16px 0 ${alpha(ERROR.main, 0.24)}`,
};

// Build the 25-level MUI shadows array from the Figma z-elevations.
function buildShadows(): string[] {
  const c = (a: number) => `rgba(${GREY_CH}, ${a})`;
  const levels = [
    'none',
    `0 1px 2px 0 ${c(0.16)}`,
    `0 1px 2px 0 ${c(0.16)}`,
    `0 1px 2px 0 ${c(0.16)}`,
    `0 4px 8px 0 ${c(0.16)}`,
    `0 4px 8px 0 ${c(0.16)}`,
    `0 4px 8px 0 ${c(0.16)}`,
    `0 4px 8px 0 ${c(0.16)}`,
    `0 8px 16px 0 ${c(0.16)}`,
    `0 8px 16px 0 ${c(0.16)}`,
    `0 8px 16px 0 ${c(0.16)}`,
    `0 8px 16px 0 ${c(0.16)}`,
    `0 12px 24px -4px ${c(0.16)}`,
    `0 12px 24px -4px ${c(0.16)}`,
    `0 12px 24px -4px ${c(0.16)}`,
    `0 12px 24px -4px ${c(0.16)}`,
    `0 16px 32px -4px ${c(0.16)}`,
    `0 16px 32px -4px ${c(0.16)}`,
    `0 16px 32px -4px ${c(0.16)}`,
    `0 16px 32px -4px ${c(0.16)}`,
    `0 20px 40px -4px ${c(0.16)}`,
    `0 20px 40px -4px ${c(0.16)}`,
    `0 20px 40px -4px ${c(0.16)}`,
    `0 20px 40px -4px ${c(0.16)}`,
    `0 24px 48px 0 ${c(0.16)}`,
  ];
  return levels;
}

const pxToRem = (px: number) => `${px / 16}rem`;

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: PRIMARY,
    secondary: SECONDARY,
    info: INFO,
    success: SUCCESS,
    warning: WARNING,
    error: ERROR,
    grey: GREY,
    common: { black: '#000000', white: '#FFFFFF' },
    divider: alpha(GREY[500], 0.2),
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      disabled: GREY[500],
    },
    background: {
      paper: '#FFFFFF',
      default: '#FFFFFF',
    },
    action: {
      active: GREY[600],
      hover: alpha(GREY[500], 0.08),
      selected: alpha(GREY[500], 0.16),
      disabled: alpha(GREY[500], 0.8),
      disabledBackground: alpha(GREY[500], 0.24),
      focus: alpha(GREY[500], 0.24),
      hoverOpacity: 0.08,
      disabledOpacity: 0.48,
    },
  },

  shape: { borderRadius: 8 },

  customShadows,
  shadows: buildShadows() as unknown as Shadows,

  typography: {
    fontFamily: "'Public Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: { fontWeight: 800, lineHeight: 80 / 64, fontSize: pxToRem(40), letterSpacing: 0 },
    h2: { fontWeight: 800, lineHeight: 64 / 48, fontSize: pxToRem(32) },
    h3: { fontWeight: 700, lineHeight: 1.5, fontSize: pxToRem(24) },
    h4: { fontWeight: 700, lineHeight: 1.5, fontSize: pxToRem(20) },
    h5: { fontWeight: 700, lineHeight: 1.5, fontSize: pxToRem(18) },
    h6: { fontWeight: 700, lineHeight: 28 / 18, fontSize: pxToRem(17) },
    subtitle1: { fontWeight: 600, lineHeight: 1.5, fontSize: pxToRem(16) },
    subtitle2: { fontWeight: 600, lineHeight: 22 / 14, fontSize: pxToRem(14) },
    body1: { fontWeight: 400, lineHeight: 1.5, fontSize: pxToRem(16) },
    body2: { fontWeight: 400, lineHeight: 22 / 14, fontSize: pxToRem(14) },
    caption: { fontWeight: 400, lineHeight: 1.5, fontSize: pxToRem(12) },
    overline: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: pxToRem(12),
      textTransform: 'uppercase',
    },
    button: { fontWeight: 700, lineHeight: 24 / 14, fontSize: pxToRem(14), textTransform: 'none' },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: GREY[100] },
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-thumb': {
          background: GREY[400],
          borderRadius: 8,
          border: '2px solid transparent',
          backgroundClip: 'content-box',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          background: GREY[500],
          backgroundClip: 'content-box',
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8 },
        sizeLarge: { minHeight: 48 },
        sizeMedium: { minHeight: 36 },
        sizeSmall: { minHeight: 30 },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: { '&:hover': { boxShadow: customShadows.primary } },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: { '&:hover': { boxShadow: customShadows.secondary } },
        },
        {
          props: { variant: 'contained', color: 'error' },
          style: { '&:hover': { boxShadow: customShadows.error } },
        },
      ],
    },

    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 16 },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          position: 'relative',
          borderRadius: 16,
          zIndex: 0,
          boxShadow: customShadows.card,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(GREY[500], 0.2),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: GREY[800],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: GREY[800],
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: ERROR.main,
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(GREY[500], 0.2),
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: { '&.Mui-focused': { color: GREY[800] } },
      },
    },

    MuiChip: {
      styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          boxShadow: customShadows.dropdown,
        },
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          boxShadow: customShadows.dropdown,
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          marginInline: 6,
          '&.Mui-selected': {
            backgroundColor: alpha(PRIMARY.main, 0.08),
            '&:hover': { backgroundColor: alpha(PRIMARY.main, 0.16) },
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16, boxShadow: customShadows.dialog },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundImage: 'none' },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: alpha(PRIMARY.main, 0.08),
            color: PRIMARY.main,
            '&:hover': { backgroundColor: alpha(PRIMARY.main, 0.16) },
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: GREY[800], borderRadius: 8, fontSize: 12 },
        arrow: { color: GREY[800] },
      },
    },
  },
});

// ─── Type augmentation for the custom shadows key ───────────────
declare module '@mui/material/styles' {
  interface Theme {
    customShadows: typeof customShadows;
  }
  interface ThemeOptions {
    customShadows?: typeof customShadows;
  }
}
```

### `src/types/index.ts`
```ts
// Core TypeScript interfaces for StoryMap.

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string; // ISO date string
}

export interface StoryMap {
  id: string;
  projectId: string;
  name: string;
  createdAt: string; // ISO date string
  createdBy: string; // hardcoded "You" for MVP (no auth)
  // Counts are derived from the board store (not stored here) — see StoryMapCard.
}

// ─── Board entities ─────────────────────────────────────────────

export interface Journey {
  id: string;
  mapId: string;
  title: string;
  order: number; // display order across the board
}

export interface Step {
  id: string;
  journeyId: string;
  mapId: string; // denormalized for easy "all steps for map X" queries
  title: string;
  order: number; // order within its journey
  // Display number ("1.0") is derived: journeyIndex.stepOrder — never stored.
}

export interface Release {
  id: string;
  mapId: string;
  name: string;
  order: number; // vertical stacking order
}

export interface Story {
  id: string;
  releaseId: string;
  mapId: string; // denormalized
  title: string;
  description: string;
  order: number; // within its release
  attachments: Attachment[];
  comments: Comment[];
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string; // MIME type
  dataUrl: string; // base64 data URL
  uploadedAt: string;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

// ─── Delete confirmation target ─────────────────────────────────

export type DeleteTargetType =
  | 'project'
  | 'storyMap'
  | 'journey'
  | 'step'
  | 'release'
  | 'story';

export interface DeleteTarget {
  type: DeleteTargetType;
  id: string;
  label: string; // shown in the modal
}
```

### `src/lib/idgen.ts`
```ts
// Thin wrapper around crypto.randomUUID so call sites stay tidy
// and we have a single place to swap the implementation later.
export function generateId(): string {
  return crypto.randomUUID();
}
```

### `src/lib/dateFormat.ts`
```ts
// Consistent, human-readable date formatting across the app.
// Example: "Jun 10, 2026"
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Relative time, e.g. "just now", "5m ago", "2h ago", "3d ago".
// Falls back to an absolute date for anything older than a week.
export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 45) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}
```

### `src/lib/storage.ts`
```ts
// localStorage size helpers used to warn the user before they hit the
// browser's ~5MB origin limit (base64 attachments are the main risk).

export const STORAGE_LIMIT_BYTES = 5 * 1024 * 1024; // ~5MB typical cap
export const STORAGE_WARN_BYTES = 4 * 1024 * 1024; // soft warning threshold
export const ATTACHMENT_WARN_BYTES = 1 * 1024 * 1024; // per-file warning

// Approximate bytes currently used by this origin's localStorage.
export function getStorageUsageBytes(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const value = localStorage.getItem(key) ?? '';
    total += (key.length + value.length) * 2;
  }
  return total;
}

export function isStorageNearlyFull(): boolean {
  return getStorageUsageBytes() >= STORAGE_WARN_BYTES;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
```

### `src/hooks/useEscapeKey.ts` (present but currently unused)
```ts
import { useEffect } from 'react';

// Calls `handler` when Escape is pressed, while `active` is true.
export function useEscapeKey(active: boolean, handler: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, handler]);
}
```

### `src/hooks/useClickOutside.ts` (present but currently unused)
```ts
import { useEffect, type RefObject } from 'react';

// Calls `handler` when a pointerdown occurs outside the referenced element,
// while `active` is true.
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  active: boolean,
  handler: () => void
) {
  useEffect(() => {
    if (!active) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [ref, active, handler]);
}
```

### `src/store/seed.ts`
```ts
import type { Project, StoryMap, Journey, Step, Release, Story } from '../types';

export const seedProjects: Project[] = [
  {
    id: 'proj-mobile-banking',
    name: 'Mobile Banking App',
    description: 'Consumer banking app — onboarding, payments, and account management.',
    createdAt: '2026-05-02T09:00:00.000Z',
  },
  {
    id: 'proj-marketplace',
    name: 'Artisan Marketplace',
    description: 'Two-sided marketplace connecting local makers with buyers.',
    createdAt: '2026-05-18T14:30:00.000Z',
  },
  {
    id: 'proj-fitness',
    name: 'Fitness Tracker',
    description: 'Habit and workout tracking with weekly progress summaries.',
    createdAt: '2026-06-01T08:15:00.000Z',
  },
];

export const seedStoryMaps: StoryMap[] = [
  {
    id: 'map-onboarding',
    projectId: 'proj-mobile-banking',
    name: 'Onboarding & KYC Flow',
    createdAt: '2026-05-03T10:00:00.000Z',
    createdBy: 'You',
  },
  {
    id: 'map-payments',
    projectId: 'proj-mobile-banking',
    name: 'Payments & Transfers',
    createdAt: '2026-05-10T11:20:00.000Z',
    createdBy: 'You',
  },
  {
    id: 'map-seller',
    projectId: 'proj-marketplace',
    name: 'Seller Onboarding',
    createdAt: '2026-05-19T16:00:00.000Z',
    createdBy: 'You',
  },
  {
    id: 'map-checkout',
    projectId: 'proj-marketplace',
    name: 'Buyer Checkout',
    createdAt: '2026-05-25T13:45:00.000Z',
    createdBy: 'You',
  },
  {
    id: 'map-workout',
    projectId: 'proj-fitness',
    name: 'Workout Logging',
    createdAt: '2026-06-02T09:30:00.000Z',
    createdBy: 'You',
  },
];

// ─── Seed board data (for "Onboarding & KYC Flow") ───────────────
const MAP = 'map-onboarding';

export const seedJourneys: Journey[] = [
  { id: 'jny-discover', mapId: MAP, title: 'Discover', order: 0 },
  { id: 'jny-signup', mapId: MAP, title: 'Sign Up', order: 1 },
  { id: 'jny-verify', mapId: MAP, title: 'Verify Identity', order: 2 },
  { id: 'jny-start', mapId: MAP, title: 'Get Started', order: 3 },
];

export const seedSteps: Step[] = [
  { id: 'stp-1', journeyId: 'jny-discover', mapId: MAP, title: 'Land on website', order: 0 },
  { id: 'stp-2', journeyId: 'jny-discover', mapId: MAP, title: 'Compare plans', order: 1 },
  { id: 'stp-3', journeyId: 'jny-signup', mapId: MAP, title: 'Enter email', order: 0 },
  { id: 'stp-4', journeyId: 'jny-signup', mapId: MAP, title: 'Create password', order: 1 },
  { id: 'stp-5', journeyId: 'jny-signup', mapId: MAP, title: 'Accept terms', order: 2 },
  { id: 'stp-6', journeyId: 'jny-verify', mapId: MAP, title: 'Upload ID', order: 0 },
  { id: 'stp-7', journeyId: 'jny-verify', mapId: MAP, title: 'Take a selfie', order: 1 },
  { id: 'stp-8', journeyId: 'jny-verify', mapId: MAP, title: 'Await approval', order: 2 },
  { id: 'stp-9', journeyId: 'jny-start', mapId: MAP, title: 'Link first account', order: 0 },
  { id: 'stp-10', journeyId: 'jny-start', mapId: MAP, title: 'Tour the dashboard', order: 1 },
];

export const seedReleases: Release[] = [
  { id: 'rel-mvp', mapId: MAP, name: 'Release 1 — MVP', order: 0 },
  { id: 'rel-fast', mapId: MAP, name: 'Release 2 — Fast Follow', order: 1 },
];

const story = (
  id: string,
  releaseId: string,
  title: string,
  order: number
): Story => ({
  id,
  releaseId,
  mapId: MAP,
  title,
  description: '',
  order,
  attachments: [],
  comments: [],
  createdAt: '2026-05-03T10:00:00.000Z',
});

export const seedStories: Story[] = [
  story('sty-1', 'rel-mvp', 'Email + password sign up', 0),
  story('sty-2', 'rel-mvp', 'Basic ID upload', 1),
  story('sty-3', 'rel-mvp', 'Manual approval queue', 2),
  story('sty-4', 'rel-fast', 'Selfie liveness check', 0),
  story('sty-5', 'rel-fast', 'Auto-approval for low risk', 1),
];
```

### `src/store/projectStore.ts`
```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, StoryMap, DeleteTarget } from '../types';
import { generateId } from '../lib/idgen';
import { seedProjects, seedStoryMaps } from './seed';
import { useBoardStore } from './boardStore';

interface ProjectState {
  // ─── Persisted data ───────────────────────────────
  projects: Project[];
  storyMaps: StoryMap[];
  selectedProjectId: string | null;

  // ─── UI state (not persisted) ─────────────────────
  isCreateProjectModalOpen: boolean;
  isCreateStoryMapModalOpen: boolean;
  confirmDeleteTarget: DeleteTarget | null;

  // ─── Project actions ──────────────────────────────
  addProject: (name: string, description: string) => void;
  selectProject: (id: string) => void;
  deleteProject: (id: string) => void; // cascades maps + their board data

  // ─── Story map actions ────────────────────────────
  addStoryMap: (projectId: string, name: string) => StoryMap;
  updateStoryMap: (id: string, patch: Partial<Pick<StoryMap, 'name'>>) => void;
  deleteStoryMap: (id: string) => void; // cascades its board data

  // ─── Modal controls ───────────────────────────────
  openCreateProjectModal: () => void;
  closeCreateProjectModal: () => void;
  openCreateStoryMapModal: () => void;
  closeCreateStoryMapModal: () => void;
  setConfirmDeleteTarget: (target: DeleteTarget | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: seedProjects,
      storyMaps: seedStoryMaps,
      selectedProjectId: seedProjects[0]?.id ?? null,

      isCreateProjectModalOpen: false,
      isCreateStoryMapModalOpen: false,
      confirmDeleteTarget: null,

      addProject: (name, description) =>
        set((state) => {
          const project: Project = {
            id: generateId(),
            name: name.trim(),
            description: description.trim(),
            createdAt: new Date().toISOString(),
          };
          return {
            projects: [...state.projects, project],
            selectedProjectId: project.id,
          };
        }),

      selectProject: (id) => set({ selectedProjectId: id }),

      deleteProject: (id) => {
        const state = get();
        const maps = state.storyMaps.filter((m) => m.projectId === id);
        // Cascade: clear each map's board data in the board store.
        maps.forEach((m) => useBoardStore.getState().deleteMapData(m.id));

        const remainingProjects = state.projects.filter((p) => p.id !== id);
        set({
          projects: remainingProjects,
          storyMaps: state.storyMaps.filter((m) => m.projectId !== id),
          // Keep a valid selection.
          selectedProjectId:
            state.selectedProjectId === id
              ? remainingProjects[0]?.id ?? null
              : state.selectedProjectId,
        });
      },

      addStoryMap: (projectId, name) => {
        const storyMap: StoryMap = {
          id: generateId(),
          projectId,
          name: name.trim(),
          createdAt: new Date().toISOString(),
          createdBy: 'You',
        };
        set((state) => ({ storyMaps: [...state.storyMaps, storyMap] }));
        return storyMap;
      },

      updateStoryMap: (id, patch) =>
        set((state) => ({
          storyMaps: state.storyMaps.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),

      deleteStoryMap: (id) => {
        useBoardStore.getState().deleteMapData(id); // cascade board data
        set((state) => ({ storyMaps: state.storyMaps.filter((m) => m.id !== id) }));
      },

      openCreateProjectModal: () => set({ isCreateProjectModalOpen: true }),
      closeCreateProjectModal: () => set({ isCreateProjectModalOpen: false }),
      openCreateStoryMapModal: () => set({ isCreateStoryMapModalOpen: true }),
      closeCreateStoryMapModal: () => set({ isCreateStoryMapModalOpen: false }),
      setConfirmDeleteTarget: (target) => set({ confirmDeleteTarget: target }),
    }),
    {
      name: 'storymap-data',
      version: 1,
      migrate: (persisted) => persisted as ProjectState,
      partialize: (state) => ({
        projects: state.projects,
        storyMaps: state.storyMaps,
        selectedProjectId: state.selectedProjectId,
      }),
    }
  )
);
```

### `src/store/boardStore.ts`
```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Journey, Step, Release, Story, Attachment } from '../types';
import { generateId } from '../lib/idgen';
import { seedJourneys, seedSteps, seedReleases, seedStories } from './seed';

interface BoardState {
  // Flat arrays, relations by id.
  journeys: Journey[];
  steps: Step[];
  releases: Release[];
  stories: Story[];

  // ─── UI state (not persisted) ─────────────────────
  activeStoryId: string | null;
  openStoryDrawer: (id: string) => void;
  closeStoryDrawer: () => void;

  // ─── Journey actions ──────────────────────────────
  addJourney: (mapId: string) => void;
  updateJourney: (id: string, patch: Partial<Pick<Journey, 'title'>>) => void;
  deleteJourney: (id: string) => void; // cascades its steps

  // ─── Step actions ─────────────────────────────────
  addStep: (journeyId: string, mapId: string) => void;
  updateStep: (id: string, patch: Partial<Pick<Step, 'title'>>) => void;
  deleteStep: (id: string) => void;

  // ─── Release actions ──────────────────────────────
  addRelease: (mapId: string) => void;
  updateRelease: (id: string, patch: Partial<Pick<Release, 'name'>>) => void;
  deleteRelease: (id: string) => void; // cascades its stories

  // ─── Story actions ────────────────────────────────
  addStory: (releaseId: string, mapId: string) => void;
  updateStory: (id: string, patch: Partial<Pick<Story, 'title' | 'description'>>) => void;
  deleteStory: (id: string) => void;
  addComment: (storyId: string, text: string) => void;
  addAttachment: (storyId: string, attachment: Attachment) => void;
  deleteAttachment: (storyId: string, attachmentId: string) => void;

  // ─── Cross-store cascade ──────────────────────────
  deleteMapData: (mapId: string) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      journeys: seedJourneys,
      steps: seedSteps,
      releases: seedReleases,
      stories: seedStories,

      activeStoryId: null,
      openStoryDrawer: (id) => set({ activeStoryId: id }),
      closeStoryDrawer: () => set({ activeStoryId: null }),

      addJourney: (mapId) =>
        set((state) => {
          const order = state.journeys.filter((j) => j.mapId === mapId).length;
          const journey: Journey = {
            id: generateId(),
            mapId,
            title: 'New Journey',
            order,
          };
          return { journeys: [...state.journeys, journey] };
        }),

      updateJourney: (id, patch) =>
        set((state) => ({
          journeys: state.journeys.map((j) => (j.id === id ? { ...j, ...patch } : j)),
        })),

      deleteJourney: (id) =>
        set((state) => ({
          journeys: state.journeys.filter((j) => j.id !== id),
          steps: state.steps.filter((s) => s.journeyId !== id), // cascade
        })),

      addStep: (journeyId, mapId) =>
        set((state) => {
          const order = state.steps.filter((s) => s.journeyId === journeyId).length;
          const step: Step = {
            id: generateId(),
            journeyId,
            mapId,
            title: 'Untitled Step',
            order,
          };
          return { steps: [...state.steps, step] };
        }),

      updateStep: (id, patch) =>
        set((state) => ({
          steps: state.steps.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),

      deleteStep: (id) =>
        set((state) => ({ steps: state.steps.filter((s) => s.id !== id) })),

      addRelease: (mapId) =>
        set((state) => {
          const count = state.releases.filter((r) => r.mapId === mapId).length;
          const release: Release = {
            id: generateId(),
            mapId,
            name: `Release ${count + 1}`,
            order: count,
          };
          return { releases: [...state.releases, release] };
        }),

      updateRelease: (id, patch) =>
        set((state) => ({
          releases: state.releases.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),

      deleteRelease: (id) =>
        set((state) => ({
          releases: state.releases.filter((r) => r.id !== id),
          stories: state.stories.filter((s) => s.releaseId !== id), // cascade
        })),

      addStory: (releaseId, mapId) =>
        set((state) => {
          const order = state.stories.filter((s) => s.releaseId === releaseId).length;
          const story: Story = {
            id: generateId(),
            releaseId,
            mapId,
            title: 'Untitled Story',
            description: '',
            order,
            attachments: [],
            comments: [],
            createdAt: new Date().toISOString(),
          };
          return { stories: [...state.stories, story] };
        }),

      updateStory: (id, patch) =>
        set((state) => ({
          stories: state.stories.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),

      deleteStory: (id) =>
        set((state) => ({ stories: state.stories.filter((s) => s.id !== id) })),

      addComment: (storyId, text) =>
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === storyId
              ? {
                  ...s,
                  comments: [
                    ...s.comments,
                    { id: generateId(), text, createdAt: new Date().toISOString() },
                  ],
                }
              : s
          ),
        })),

      addAttachment: (storyId, attachment) =>
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === storyId ? { ...s, attachments: [...s.attachments, attachment] } : s
          ),
        })),

      deleteAttachment: (storyId, attachmentId) =>
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === storyId
              ? { ...s, attachments: s.attachments.filter((a) => a.id !== attachmentId) }
              : s
          ),
        })),

      deleteMapData: (mapId) =>
        set((state) => ({
          journeys: state.journeys.filter((j) => j.mapId !== mapId),
          steps: state.steps.filter((s) => s.mapId !== mapId),
          releases: state.releases.filter((r) => r.mapId !== mapId),
          stories: state.stories.filter((s) => s.mapId !== mapId),
        })),
    }),
    {
      name: 'storymap-board',
      version: 1,
      migrate: (persisted) => persisted as BoardState,
      partialize: (state) => ({
        journeys: state.journeys,
        steps: state.steps,
        releases: state.releases,
        stories: state.stories,
      }),
    }
  )
);
```

### `src/components/shared/Button.tsx`
```tsx
import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button';

type Variant = 'primary' | 'ghost' | 'danger';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
  variant?: Variant;
}

export function Button({ variant = 'primary', sx, ...props }: ButtonProps) {
  if (variant === 'ghost') {
    return (
      <MuiButton
        variant="text"
        color="inherit"
        sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' }, ...sx }}
        {...props}
      />
    );
  }

  return (
    <MuiButton
      variant="contained"
      color={variant === 'danger' ? 'error' : 'primary'}
      sx={sx}
      {...props}
    />
  );
}
```

### `src/components/shared/Input.tsx`
```tsx
import TextField, { type TextFieldProps } from '@mui/material/TextField';

export function Input(props: TextFieldProps) {
  return <TextField fullWidth size="small" {...props} />;
}
```

### `src/components/shared/Textarea.tsx`
```tsx
import TextField, { type TextFieldProps } from '@mui/material/TextField';

export function Textarea({ rows = 3, ...props }: TextFieldProps & { rows?: number }) {
  return <TextField fullWidth multiline minRows={rows} {...props} />;
}
```

### `src/components/shared/Modal.tsx`
```tsx
import type { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
    >
      <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>
        {title}
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
```

### `src/components/shared/Card.tsx`
```tsx
import MuiCard, { type CardProps as MuiCardProps } from '@mui/material/Card';

export function Card({ children, sx, ...props }: MuiCardProps) {
  return (
    <MuiCard
      sx={{
        p: 2.5,
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': { boxShadow: (theme) => theme.customShadows.z16 },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiCard>
  );
}
```

### `src/components/shared/Badge.tsx`
```tsx
import type { ReactNode } from 'react';
import Chip from '@mui/material/Chip';
import type { SxProps, Theme } from '@mui/material/styles';

type Tone = 'primary' | 'accent' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  sx?: SxProps<Theme>;
}

const toneSx: Record<Tone, object> = {
  primary: { bgcolor: 'primary.light', color: 'primary.main' },
  accent: { bgcolor: 'secondary.main', color: 'secondary.contrastText' },
  neutral: { bgcolor: 'grey.100', color: 'text.secondary' },
};

export function Badge({ children, tone = 'neutral', sx }: BadgeProps) {
  return (
    <Chip
      label={children}
      size="small"
      sx={[{ fontWeight: 600 }, toneSx[tone], ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
}
```

### `src/components/shared/EmptyState.tsx`
```tsx
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3,
        py: 10,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 4,
        bgcolor: 'background.paper',
      }}
    >
      {icon && (
        <Box
          sx={{
            mb: 2,
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            bgcolor: 'grey.50',
            fontSize: 30,
          }}
        >
          {icon}
        </Box>
      )}
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 360 }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 3 }}>{action}</Box>}
    </Box>
  );
}
```

### `src/components/shared/ThreeDotMenu.tsx`
```tsx
import { useState, type MouseEvent } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { SxProps, Theme } from '@mui/material/styles';

interface ThreeDotMenuProps {
  onRename?: () => void;
  onDelete?: () => void;
  triggerSx?: SxProps<Theme>;
}

export function ThreeDotMenu({ onRename, onDelete, triggerSx }: ThreeDotMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const openMenu = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const closeMenu = (e?: object) => {
    (e as MouseEvent)?.stopPropagation?.();
    setAnchorEl(null);
  };
  const run = (fn?: () => void) => (e: MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
    fn?.();
  };

  return (
    <>
      <IconButton
        size="small"
        aria-label="Actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={openMenu}
        sx={{ color: 'text.secondary', ...triggerSx }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ list: { dense: true } }}
      >
        {onRename && (
          <MenuItem onClick={run(onRename)}>
            <ListItemText>Rename</ListItemText>
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={run(onDelete)} sx={{ color: 'error.main' }}>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
```

### `src/components/shared/InlineEditInput.tsx`
```tsx
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import type { SxProps, Theme } from '@mui/material/styles';

export interface InlineEditHandle {
  beginEdit: () => void;
}

interface InlineEditInputProps {
  value: string;
  onSave: (next: string) => void;
  ariaLabel?: string;
  sx?: SxProps<Theme>;
}

export const InlineEditInput = forwardRef<InlineEditHandle, InlineEditInputProps>(
  function InlineEditInput({ value, onSave, ariaLabel, sx }, ref) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({ beginEdit: () => setEditing(true) }), []);

    useEffect(() => {
      if (!editing) setDraft(value);
    }, [value, editing]);

    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }, [editing]);

    const commit = () => {
      const trimmed = draft.trim();
      if (trimmed && trimmed !== value) onSave(trimmed);
      else setDraft(value);
      setEditing(false);
    };

    const cancel = () => {
      setDraft(value);
      setEditing(false);
    };

    if (editing) {
      return (
        <InputBase
          inputRef={inputRef}
          value={draft}
          fullWidth
          inputProps={{ 'aria-label': ariaLabel }}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              cancel();
            }
          }}
          sx={{
            font: 'inherit',
            color: 'inherit',
            px: 0.5,
            py: 0,
            borderRadius: 1,
            outline: '2px solid',
            outlineColor: 'primary.light',
            ...sx,
          }}
        />
      );
    }

    return (
      <Box
        component="span"
        role="button"
        tabIndex={0}
        title="Click to edit"
        onClick={() => setEditing(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setEditing(true);
        }}
        sx={{ cursor: 'text', ...sx }}
      >
        {value}
      </Box>
    );
  }
);
```

### `src/components/shared/SearchInput.tsx`
```tsx
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

// Search field matching the Figma "Minimal_Web" search component (node 5796:133417).
export function SearchInput(props: TextFieldProps) {
  return (
    <TextField
      fullWidth
      placeholder="Search"
      {...props}
      slotProps={{
        ...props.slotProps,
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon sx={{ fontSize: 24, color: 'text.disabled' }} />
            </InputAdornment>
          ),
          ...(props.slotProps?.input as object),
        },
      }}
      sx={[
        {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            pl: '14px',
            pr: '14px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(145, 158, 171, 0.32)',
            },
          },
          '& .MuiInputAdornment-root': { mr: 1 },
          '& .MuiOutlinedInput-input': {
            px: 0,
            py: '8px',
            fontSize: 16,
            lineHeight: '24px',
            height: 24,
            '&::placeholder': { color: 'text.disabled', opacity: 1 },
          },
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
}
```

### `src/components/shared/Logo.tsx`
```tsx
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

interface LogoProps {
  variant?: 'black' | 'white';
  height?: number;
  sx?: SxProps<Theme>;
}

// Renders the provided "Software Co" logo SVGs from /public (unchanged).
export function Logo({ variant = 'black', height = 28, sx }: LogoProps) {
  return (
    <Box
      component="img"
      src={variant === 'white' ? '/logo-white.svg' : '/logo-black.svg'}
      alt="Software Co"
      sx={[
        { height, width: 'auto', display: 'block', userSelect: 'none' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
```

### `src/components/layout/AppLayout.tsx`
```tsx
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Sidebar } from './Sidebar';
import { CreateProjectModal } from '../modals/CreateProjectModal';
import { CreateStoryMapModal } from '../modals/CreateStoryMapModal';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';

export function AppLayout() {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'grey.100' }}>
      <Sidebar />
      <Box component="main" sx={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
        <Outlet />
      </Box>
      <CreateProjectModal />
      <CreateStoryMapModal />
      <ConfirmDeleteModal />
    </Box>
  );
}
```

### `src/components/layout/Header.tsx`
```tsx
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface HeaderProps {
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 4,
        py: 2.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h6"
          component="h1"
          noWrap
          sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.25 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>{actions}</Box>
      )}
    </Box>
  );
}
```

### `src/components/layout/Sidebar.tsx`
```tsx
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useProjectStore } from '../../store/projectStore';
import { Button } from '../shared/Button';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';
import { Logo } from '../shared/Logo';

export function Sidebar() {
  const navigate = useNavigate();
  const projects = useProjectStore((s) => s.projects);
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const selectProject = useProjectStore((s) => s.selectProject);
  const openModal = useProjectStore((s) => s.openCreateProjectModal);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);

  const handleSelect = (id: string) => {
    selectProject(id);
    navigate('/');
  };

  return (
    <Box
      component="aside"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 256,
        height: '100%',
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2.5, py: 3 }}>
        <Logo variant="black" height={22} />
      </Box>

      {/* Project list */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            px: 1,
            pt: 1,
            pb: 0.5,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'text.disabled',
          }}
        >
          Projects
        </Typography>

        {projects.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 1, py: 2 }}>
            Create a project to get started.
          </Typography>
        ) : (
          <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {projects.map((project) => {
              const active = project.id === selectedProjectId;
              return (
                <ListItem
                  key={project.id}
                  disablePadding
                  secondaryAction={
                    <ThreeDotMenu
                      onDelete={() =>
                        setConfirmDeleteTarget({
                          type: 'project',
                          id: project.id,
                          label: `Delete project “${project.name}” and all its story maps?`,
                        })
                      }
                    />
                  }
                  sx={{ '& .MuiListItemSecondaryAction-root': { right: 4 } }}
                >
                  <ListItemButton
                    selected={active}
                    onClick={() => handleSelect(project.id)}
                    sx={{ borderRadius: 2, pr: 5 }}
                  >
                    <ListItemText
                      primary={project.name}
                      slotProps={{
                        primary: {
                          noWrap: true,
                          sx: { fontSize: 14, fontWeight: active ? 600 : 500 },
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      {/* Create project */}
      <Box sx={{ p: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={openModal} fullWidth>
          + Create Project
        </Button>
      </Box>
    </Box>
  );
}
```

### `src/components/modals/CreateProjectModal.tsx`
```tsx
import { useState, type FormEvent } from 'react';
import Box from '@mui/material/Box';
import { useProjectStore } from '../../store/projectStore';
import { Modal } from '../shared/Modal';
import { Input } from '../shared/Input';
import { Textarea } from '../shared/Textarea';
import { Button } from '../shared/Button';

export function CreateProjectModal() {
  const isOpen = useProjectStore((s) => s.isCreateProjectModalOpen);
  const closeModal = useProjectStore((s) => s.closeCreateProjectModal);
  const addProject = useProjectStore((s) => s.addProject);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setName('');
    setDescription('');
    setError('');
  };

  const handleClose = () => {
    reset();
    closeModal();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    addProject(name, description);
    reset();
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Project">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Input
          id="project-name"
          label="Project name"
          placeholder="e.g. Mobile Banking App"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          error={!!error}
          helperText={error}
          autoFocus
        />
        <Textarea
          id="project-description"
          label="Description"
          placeholder="What is this project about?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Create Project</Button>
        </Box>
      </Box>
    </Modal>
  );
}
```

### `src/components/modals/CreateStoryMapModal.tsx`
```tsx
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useProjectStore } from '../../store/projectStore';
import { Modal } from '../shared/Modal';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';

export function CreateStoryMapModal() {
  const navigate = useNavigate();
  const isOpen = useProjectStore((s) => s.isCreateStoryMapModalOpen);
  const closeModal = useProjectStore((s) => s.closeCreateStoryMapModal);
  const addStoryMap = useProjectStore((s) => s.addStoryMap);
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setName('');
    setError('');
  };

  const handleClose = () => {
    reset();
    closeModal();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;
    if (!name.trim()) {
      setError('Story map name is required.');
      return;
    }
    const map = addStoryMap(selectedProjectId, name);
    reset();
    closeModal();
    navigate(`/board/${map.id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Story Map">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <Input
          id="storymap-name"
          label="Story map name"
          placeholder="e.g. Onboarding & KYC Flow"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          error={!!error}
          helperText={error}
          autoFocus
        />
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Create Story Map</Button>
        </Box>
      </Box>
    </Modal>
  );
}
```

### `src/components/modals/ConfirmDeleteModal.tsx`
```tsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useProjectStore } from '../../store/projectStore';
import { useBoardStore } from '../../store/boardStore';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';

export function ConfirmDeleteModal() {
  const target = useProjectStore((s) => s.confirmDeleteTarget);
  const clear = useProjectStore((s) => s.setConfirmDeleteTarget);

  const deleteProject = useProjectStore((s) => s.deleteProject);
  const deleteStoryMap = useProjectStore((s) => s.deleteStoryMap);
  const deleteJourney = useBoardStore((s) => s.deleteJourney);
  const deleteStep = useBoardStore((s) => s.deleteStep);
  const deleteRelease = useBoardStore((s) => s.deleteRelease);
  const deleteStory = useBoardStore((s) => s.deleteStory);

  const handleConfirm = () => {
    if (!target) return;
    switch (target.type) {
      case 'project':
        deleteProject(target.id);
        break;
      case 'storyMap':
        deleteStoryMap(target.id);
        break;
      case 'journey':
        deleteJourney(target.id);
        break;
      case 'step':
        deleteStep(target.id);
        break;
      case 'release':
        deleteRelease(target.id);
        break;
      case 'story':
        deleteStory(target.id);
        break;
    }
    clear(null);
  };

  return (
    <Modal isOpen={!!target} onClose={() => clear(null)} title="Confirm delete">
      <Typography variant="body2" color="text.secondary">
        {target?.label}
        <br />
        This can't be undone.
      </Typography>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="ghost" onClick={() => clear(null)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Delete
        </Button>
      </Box>
    </Modal>
  );
}
```

### `src/components/dashboard/StoryMapCard.tsx`
```tsx
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { StoryMap } from '../../types';
import { useProjectStore } from '../../store/projectStore';
import { useBoardStore } from '../../store/boardStore';
import { Card } from '../shared/Card';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';
import { InlineEditInput, type InlineEditHandle } from '../shared/InlineEditInput';
import { formatDate } from '../../lib/dateFormat';

interface StoryMapCardProps {
  storyMap: StoryMap;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 18, fontWeight: 700, lineHeight: 1, color: 'text.primary' }}>
        {value}
      </Typography>
      <Typography
        sx={{
          mt: 0.5,
          fontSize: 11,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: 'text.disabled',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export function StoryMapCard({ storyMap }: StoryMapCardProps) {
  const navigate = useNavigate();
  const updateStoryMap = useProjectStore((s) => s.updateStoryMap);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);
  const titleRef = useRef<InlineEditHandle>(null);

  const journeyCount = useBoardStore((s) => s.journeys.filter((j) => j.mapId === storyMap.id).length);
  const stepCount = useBoardStore((s) => s.steps.filter((st) => st.mapId === storyMap.id).length);
  const releaseCount = useBoardStore((s) => s.releases.filter((r) => r.mapId === storyMap.id).length);
  const storyCount = useBoardStore((s) => s.stories.filter((st) => st.mapId === storyMap.id).length);

  const open = () => navigate(`/board/${storyMap.id}`);

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      sx={{ cursor: 'pointer', '&:hover': { borderColor: 'primary.light' } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 2.5 }}>
        <Box component="span" sx={{ minWidth: 0, flex: 1 }} onClick={(e) => e.stopPropagation()}>
          <InlineEditInput
            ref={titleRef}
            value={storyMap.name}
            onSave={(name) => updateStoryMap(storyMap.id, { name })}
            ariaLabel="Story map name"
            sx={{ display: 'block', fontSize: 16, fontWeight: 600, color: 'text.primary' }}
          />
        </Box>
        <ThreeDotMenu
          onRename={() => titleRef.current?.beginEdit()}
          onDelete={() =>
            setConfirmDeleteTarget({
              type: 'storyMap',
              id: storyMap.id,
              label: `Delete story map “${storyMap.name}”?`,
            })
          }
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          columnGap: 1.5,
          rowGap: 2,
          mb: 2.5,
        }}
      >
        <Stat label="Journeys" value={journeyCount} />
        <Stat label="Steps" value={stepCount} />
        <Stat label="Releases" value={releaseCount} />
        <Stat label="Stories" value={storyCount} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          fontSize: 12,
          color: 'text.secondary',
        }}
      >
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            component="span"
            sx={{
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              bgcolor: 'primary.lighter',
              color: 'primary.dark',
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            {storyMap.createdBy.charAt(0)}
          </Box>
          {storyMap.createdBy}
        </Box>
        <span>{formatDate(storyMap.createdAt)}</span>
      </Box>
    </Card>
  );
}
```

### `src/components/board/BoardCanvas.tsx`
```tsx
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { useBoardStore } from '../../store/boardStore';
import { JourneyColumn } from './JourneyColumn';
import { EmptyState } from '../shared/EmptyState';
import { Button } from '../shared/Button';

interface BoardCanvasProps {
  mapId: string;
}

// Canvas holding journeys in a 2-column grid (2x2 for four journeys).
export function BoardCanvas({ mapId }: BoardCanvasProps) {
  const journeys = useBoardStore((s) => s.journeys);
  const addJourney = useBoardStore((s) => s.addJourney);

  const mapJourneys = journeys
    .filter((j) => j.mapId === mapId)
    .sort((a, b) => a.order - b.order);

  if (mapJourneys.length === 0) {
    return (
      <EmptyState
        icon="🧭"
        title="Let's get started"
        description="Add your first journey to begin mapping out steps."
        action={<Button onClick={() => addJourney(mapId)}>+ Add Journey</Button>}
      />
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        gap: 2.5,
        alignItems: 'start',
        maxWidth: 760,
      }}
    >
      {mapJourneys.map((journey, index) => (
        <JourneyColumn key={journey.id} journey={journey} index={index} />
      ))}

      {/* Add journey cell */}
      <ButtonBase
        onClick={() => addJourney(mapId)}
        sx={{
          minHeight: 56,
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'grey.300',
          py: 1.5,
          fontSize: 14,
          fontWeight: 600,
          color: 'text.disabled',
          transition: 'all 0.2s',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter', color: 'primary.main' },
        }}
      >
        + Add Journey
      </ButtonBase>
    </Box>
  );
}
```

### `src/components/board/JourneyColumn.tsx`
```tsx
import { useRef } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import type { Journey } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { useProjectStore } from '../../store/projectStore';
import { InlineEditInput, type InlineEditHandle } from '../shared/InlineEditInput';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';
import { StepCard } from './StepCard';

interface JourneyColumnProps {
  journey: Journey;
  index: number;
}

const dashedButtonSx = {
  borderRadius: 2,
  border: '1px dashed',
  borderColor: 'grey.300',
  py: 1.25,
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  color: 'text.disabled',
  transition: 'all 0.2s',
  '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter', color: 'primary.main' },
};

export function JourneyColumn({ journey, index }: JourneyColumnProps) {
  const updateJourney = useBoardStore((s) => s.updateJourney);
  const addStep = useBoardStore((s) => s.addStep);
  const steps = useBoardStore((s) => s.steps);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);
  const titleRef = useRef<InlineEditHandle>(null);

  const journeySteps = steps
    .filter((s) => s.journeyId === journey.id)
    .sort((a, b) => a.order - b.order);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%', minWidth: 0 }}>
      {/* Journey header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          px: 1.75,
          py: 1.25,
          boxShadow: 1,
        }}
      >
        <Box component="span" sx={{ minWidth: 0, flex: 1 }}>
          <InlineEditInput
            ref={titleRef}
            value={journey.title}
            onSave={(title) => updateJourney(journey.id, { title })}
            ariaLabel="Journey title"
            sx={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'common.white' }}
          />
        </Box>
        <ThreeDotMenu
          triggerSx={{ color: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' } }}
          onRename={() => titleRef.current?.beginEdit()}
          onDelete={() =>
            setConfirmDeleteTarget({
              type: 'journey',
              id: journey.id,
              label: `Delete journey “${journey.title}” and its steps?`,
            })
          }
        />
      </Box>

      {/* Steps */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {journeySteps.map((step, stepIndex) => (
          <StepCard key={step.id} step={step} number={`${index + 1}.${stepIndex}`} />
        ))}
      </Box>

      {/* Add step */}
      <ButtonBase onClick={() => addStep(journey.id, journey.mapId)} sx={dashedButtonSx}>
        + Add Step
      </ButtonBase>
    </Box>
  );
}
```

### `src/components/board/StepCard.tsx`
```tsx
import { useRef } from 'react';
import Box from '@mui/material/Box';
import type { Step } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { useProjectStore } from '../../store/projectStore';
import { InlineEditInput, type InlineEditHandle } from '../shared/InlineEditInput';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';

interface StepCardProps {
  step: Step;
  number: string;
}

export function StepCard({ step, number }: StepCardProps) {
  const updateStep = useBoardStore((s) => s.updateStep);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);
  const titleRef = useRef<InlineEditHandle>(null);

  return (
    <Box
      sx={{
        minHeight: 76,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderTop: '3px solid',
        borderTopColor: 'primary.main',
        bgcolor: 'background.paper',
        p: 1.5,
        boxShadow: (theme) => theme.customShadows.z1,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: (theme) => theme.customShadows.z16 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 0.5 }}>
        <Box
          component="span"
          sx={{
            display: 'inline-block',
            borderRadius: 1,
            bgcolor: 'primary.lighter',
            color: 'primary.dark',
            px: 0.75,
            py: 0.25,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {number}
        </Box>
        <ThreeDotMenu
          onRename={() => titleRef.current?.beginEdit()}
          onDelete={() =>
            setConfirmDeleteTarget({ type: 'step', id: step.id, label: `Delete step “${step.title}”?` })
          }
        />
      </Box>
      <InlineEditInput
        ref={titleRef}
        value={step.title}
        onSave={(title) => updateStep(step.id, { title })}
        ariaLabel="Step title"
        sx={{ display: 'block', mt: 0.5, fontSize: 14, fontWeight: 500, color: 'text.primary' }}
      />
    </Box>
  );
}
```

### `src/components/board/StoryCard.tsx`
```tsx
import { useRef } from 'react';
import Box from '@mui/material/Box';
import type { Story } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { useProjectStore } from '../../store/projectStore';
import { InlineEditInput, type InlineEditHandle } from '../shared/InlineEditInput';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  const updateStory = useBoardStore((s) => s.updateStory);
  const openStoryDrawer = useBoardStore((s) => s.openStoryDrawer);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);
  const titleRef = useRef<InlineEditHandle>(null);

  const open = () => openStoryDrawer(story.id);

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      sx={{
        minHeight: 60,
        cursor: 'pointer',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderTop: '3px solid',
        borderTopColor: 'secondary.main',
        bgcolor: 'background.paper',
        p: 1.25,
        boxShadow: (theme) => theme.customShadows.z1,
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: 'secondary.light',
          boxShadow: (theme) => theme.customShadows.z16,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
        {/* Stop propagation so editing the title doesn't open the drawer. */}
        <Box component="span" sx={{ flex: 1, minWidth: 0 }} onClick={(e) => e.stopPropagation()}>
          <InlineEditInput
            ref={titleRef}
            value={story.title}
            onSave={(title) => updateStory(story.id, { title })}
            ariaLabel="Story title"
            sx={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'text.primary' }}
          />
        </Box>
        <ThreeDotMenu
          onRename={() => titleRef.current?.beginEdit()}
          onDelete={() =>
            setConfirmDeleteTarget({ type: 'story', id: story.id, label: `Delete story “${story.title}”?` })
          }
        />
      </Box>
    </Box>
  );
}
```

### `src/components/board/ReleaseSection.tsx`
```tsx
import { useRef } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import type { Release } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { useProjectStore } from '../../store/projectStore';
import { InlineEditInput, type InlineEditHandle } from '../shared/InlineEditInput';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';
import { Badge } from '../shared/Badge';
import { StoryCard } from './StoryCard';

interface ReleaseSectionProps {
  release: Release;
}

export function ReleaseSection({ release }: ReleaseSectionProps) {
  const updateRelease = useBoardStore((s) => s.updateRelease);
  const addStory = useBoardStore((s) => s.addStory);
  const stories = useBoardStore((s) => s.stories);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);
  const titleRef = useRef<InlineEditHandle>(null);

  const releaseStories = stories
    .filter((s) => s.releaseId === release.id)
    .sort((a, b) => a.order - b.order);
  const storyCount = releaseStories.length;

  return (
    <Box
      component="section"
      sx={{
        overflow: 'hidden',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: (theme) => theme.customShadows.z1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'secondary.lighter',
          px: 2,
          py: 1.5,
        }}
      >
        <ThreeDotMenu
          onRename={() => titleRef.current?.beginEdit()}
          onDelete={() =>
            setConfirmDeleteTarget({
              type: 'release',
              id: release.id,
              label: `Delete release “${release.name}” and its stories?`,
            })
          }
        />
        <InlineEditInput
          ref={titleRef}
          value={release.name}
          onSave={(name) => updateRelease(release.id, { name })}
          ariaLabel="Release name"
          sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}
        />
        <Badge tone="accent" sx={{ ml: 'auto' }}>
          {`${storyCount} ${storyCount === 1 ? 'Story' : 'Stories'}`}
        </Badge>
      </Box>

      {/* Story cards — vertical stack, fixed ~320px width */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 1.5,
          px: 2,
          py: 1.5,
          '& > *': { width: 320, maxWidth: '100%' },
        }}
      >
        {releaseStories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}

        <ButtonBase
          onClick={() => addStory(release.id, release.mapId)}
          sx={{
            minHeight: 60,
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'grey.300',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'text.disabled',
            transition: 'all 0.2s',
            '&:hover': { borderColor: 'secondary.main', bgcolor: 'secondary.lighter', color: 'secondary.main' },
          }}
        >
          + Add Story
        </ButtonBase>
      </Box>
    </Box>
  );
}
```

### `src/components/board/ReleasesPanel.tsx`
```tsx
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { useBoardStore } from '../../store/boardStore';
import { ReleaseSection } from './ReleaseSection';

interface ReleasesPanelProps {
  mapId: string;
}

export function ReleasesPanel({ mapId }: ReleasesPanelProps) {
  const releases = useBoardStore((s) => s.releases);
  const addRelease = useBoardStore((s) => s.addRelease);

  const mapReleases = releases
    .filter((r) => r.mapId === mapId)
    .sort((a, b) => a.order - b.order);

  return (
    <Box sx={{ mt: 5 }}>
      {/* Pink/secondary dotted line with the Add Release button at its start. */}
      <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <ButtonBase
          onClick={() => addRelease(mapId)}
          sx={{
            flexShrink: 0,
            borderRadius: 1.25,
            border: '1px solid',
            borderColor: 'secondary.main',
            bgcolor: 'secondary.lighter',
            color: 'secondary.main',
            px: 1.5,
            py: 0.75,
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            transition: 'all 0.2s',
            '&:hover': { bgcolor: 'secondary.main', color: 'secondary.contrastText' },
          }}
        >
          + Add Release
        </ButtonBase>
        <Box sx={{ flex: 1, borderTop: '2px dashed', borderColor: 'secondary.main', opacity: 0.6 }} />
      </Box>

      {/* Stacked releases */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {mapReleases.map((release) => (
          <ReleaseSection key={release.id} release={release} />
        ))}
      </Box>
    </Box>
  );
}
```

### `src/components/drawer/StoryDrawer.tsx`
```tsx
import { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useBoardStore } from '../../store/boardStore';
import { Button } from '../shared/Button';
import { InlineEditInput } from '../shared/InlineEditInput';
import { Textarea } from '../shared/Textarea';
import { AttachmentUploader } from './AttachmentUploader';
import { CommentSection } from './CommentSection';

export function StoryDrawer() {
  const activeStoryId = useBoardStore((s) => s.activeStoryId);
  const closeStoryDrawer = useBoardStore((s) => s.closeStoryDrawer);
  const story = useBoardStore((s) => s.stories.find((st) => st.id === s.activeStoryId));
  const updateStory = useBoardStore((s) => s.updateStory);

  const [description, setDescription] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (story) {
      setDescription(story.description);
      setSavedFlash(false);
    }
  }, [story?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isDirty = !!story && description !== story.description;

  const requestClose = () => {
    if (isDirty && !window.confirm('Discard unsaved changes to the description?')) return;
    closeStoryDrawer();
  };

  const handleSave = () => {
    if (!story) return;
    updateStory(story.id, { description });
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1500);
  };

  return (
    <Drawer
      anchor="right"
      open={!!activeStoryId && !!story}
      onClose={requestClose}
      slotProps={{ paper: { sx: { width: 480, maxWidth: '100%' } } }}
    >
      {story && (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 3,
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Story details</Typography>
            <IconButton aria-label="Close" onClick={requestClose} sx={{ color: 'text.secondary' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 500 }}>
                Title
              </Typography>
              <InlineEditInput
                value={story.title}
                onSave={(title) => updateStory(story.id, { title })}
                ariaLabel="Story title"
                sx={{ display: 'block', fontSize: 20, fontWeight: 600, color: 'text.primary' }}
              />
            </Box>

            <AttachmentUploader story={story} />

            <Textarea
              label="Description"
              rows={5}
              placeholder="Add a description…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <CommentSection story={story} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1.5,
              px: 3,
              py: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'grey.50',
            }}
          >
            {savedFlash && (
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'success.main' }}>Saved ✓</Typography>
            )}
            {isDirty && !savedFlash && (
              <Typography variant="caption" color="text.secondary">
                Unsaved changes
              </Typography>
            )}
            <Button onClick={handleSave} disabled={!isDirty}>
              Save
            </Button>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
```

### `src/components/drawer/AttachmentUploader.tsx`
```tsx
import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import type { Story } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { generateId } from '../../lib/idgen';
import { ATTACHMENT_WARN_BYTES, formatBytes, isStorageNearlyFull } from '../../lib/storage';

interface AttachmentUploaderProps {
  story: Story;
}

export function AttachmentUploader({ story }: AttachmentUploaderProps) {
  const addAttachment = useBoardStore((s) => s.addAttachment);
  const deleteAttachment = useBoardStore((s) => s.deleteAttachment);
  const inputRef = useRef<HTMLInputElement>(null);
  const [warning, setWarning] = useState('');

  const handleFile = (file: File) => {
    const messages: string[] = [];
    if (file.size > ATTACHMENT_WARN_BYTES) {
      messages.push(`“${file.name}” is ${formatBytes(file.size)} — large files fill up storage fast.`);
    }

    const reader = new FileReader();
    reader.onload = () => {
      addAttachment(story.id, {
        id: generateId(),
        name: file.name,
        type: file.type,
        dataUrl: String(reader.result),
        uploadedAt: new Date().toISOString(),
      });
      if (isStorageNearlyFull()) {
        messages.push('Storage is nearly full. Consider removing large attachments.');
      }
      setWarning(messages.join(' '));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        Attachments
      </Typography>

      <ButtonBase
        onClick={() => inputRef.current?.click()}
        sx={{
          width: '100%',
          flexDirection: 'column',
          gap: 0.5,
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'divider',
          bgcolor: 'grey.200',
          py: 4,
          color: 'text.secondary',
          transition: 'all 0.2s',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter', color: 'primary.main' },
        }}
      >
        <AttachFileIcon />
        <Typography variant="body2">Click to select a file!</Typography>
      </ButtonBase>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf,.doc,.docx,.txt"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      {warning && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'warning.main' }}>
          {warning}
        </Typography>
      )}

      {story.attachments.length > 0 && (
        <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {story.attachments.map((att) => (
            <Box key={att.id} sx={{ position: 'relative' }}>
              {att.type.startsWith('image/') ? (
                <Box
                  component="img"
                  src={att.dataUrl}
                  alt={att.name}
                  sx={{ width: 64, height: 64, borderRadius: 2, border: '1px solid', borderColor: 'divider', objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    fontSize: 12,
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
                >
                  {att.name.split('.').pop()}
                </Box>
              )}
              <IconButton
                aria-label={`Remove ${att.name}`}
                onClick={() => deleteAttachment(story.id, att.id)}
                sx={{
                  position: 'absolute',
                  right: -8,
                  top: -8,
                  width: 20,
                  height: 20,
                  bgcolor: 'text.primary',
                  color: 'common.white',
                  '&:hover': { bgcolor: 'common.black' },
                }}
              >
                <CloseIcon sx={{ fontSize: 13 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
```

### `src/components/drawer/CommentSection.tsx`
```tsx
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { Story } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { formatRelativeTime } from '../../lib/dateFormat';

interface CommentSectionProps {
  story: Story;
}

export function CommentSection({ story }: CommentSectionProps) {
  const addComment = useBoardStore((s) => s.addComment);
  const [text, setText] = useState('');

  const post = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addComment(story.id, trimmed);
    setText('');
  };

  const comments = [...story.comments].reverse();

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        Comments
      </Typography>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Input
          placeholder="Add a comment…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              post();
            }
          }}
        />
        <Button onClick={post} disabled={!text.trim()}>
          Post
        </Button>
      </Box>

      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {comments.map((c) => (
          <Box component="li" key={c.id} sx={{ borderRadius: 2, bgcolor: 'grey.50', px: 1.5, py: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {c.text}
            </Typography>
            <Typography variant="caption" sx={{ mt: 0.25, display: 'block', color: 'text.secondary' }}>
              {formatRelativeTime(c.createdAt)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
```

### `src/pages/DashboardPage.tsx`
```tsx
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useProjectStore } from '../store/projectStore';
import { Header } from '../components/layout/Header';
import { StoryMapCard } from '../components/dashboard/StoryMapCard';
import { EmptyState } from '../components/shared/EmptyState';
import { Button } from '../components/shared/Button';
import { SearchInput } from '../components/shared/SearchInput';

export function DashboardPage() {
  const projects = useProjectStore((s) => s.projects);
  const storyMaps = useProjectStore((s) => s.storyMaps);
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const openCreateProjectModal = useProjectStore((s) => s.openCreateProjectModal);
  const openCreateStoryMapModal = useProjectStore((s) => s.openCreateStoryMapModal);

  const [search, setSearch] = useState('');

  useEffect(() => {
    setSearch('');
  }, [selectedProjectId]);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  );

  const mapsForProject = useMemo(
    () => storyMaps.filter((m) => m.projectId === selectedProjectId),
    [storyMaps, selectedProjectId]
  );

  const filteredMaps = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return mapsForProject;
    return mapsForProject.filter((m) => m.name.toLowerCase().includes(query));
  }, [mapsForProject, search]);

  if (!selectedProject) {
    return (
      <>
        <Header title="Dashboard" />
        <Box sx={{ flex: 1, overflowY: 'auto', p: 4 }}>
          <EmptyState
            icon="📁"
            title="No project selected"
            description="Create a project to start organizing your story maps."
            action={<Button onClick={openCreateProjectModal}>+ Create Project</Button>}
          />
        </Box>
      </>
    );
  }

  return (
    <>
      <Header title={selectedProject.name} subtitle={selectedProject.description} />

      <Box sx={{ flex: 1, overflowY: 'auto', p: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: '100%', maxWidth: 320 }}>
            <SearchInput
              id="storymap-search"
              placeholder="Search story maps…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Button onClick={openCreateStoryMapModal}>+ Create Story Map</Button>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Story Maps
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All story maps inside this project
          </Typography>
        </Box>

        {mapsForProject.length === 0 ? (
          <EmptyState
            icon="🗺️"
            title="No story maps yet"
            description="Create your first story map for this project."
            action={<Button onClick={openCreateStoryMapModal}>+ Create Story Map</Button>}
          />
        ) : filteredMaps.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No matches"
            description="No story maps match your search."
          />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 2.5,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
            }}
          >
            {filteredMaps.map((map) => (
              <StoryMapCard key={map.id} storyMap={map} />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
```

### `src/pages/StoryMapBoardPage.tsx`
```tsx
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useProjectStore } from '../store/projectStore';
import { useBoardStore } from '../store/boardStore';
import { Header } from '../components/layout/Header';
import { InlineEditInput } from '../components/shared/InlineEditInput';
import { BoardCanvas } from '../components/board/BoardCanvas';
import { ReleasesPanel } from '../components/board/ReleasesPanel';
import { StoryDrawer } from '../components/drawer/StoryDrawer';
import { EmptyState } from '../components/shared/EmptyState';
import { Button } from '../components/shared/Button';

export function StoryMapBoardPage() {
  const { mapId } = useParams<{ mapId: string }>();
  const navigate = useNavigate();
  const storyMap = useProjectStore((s) => s.storyMaps.find((m) => m.id === mapId));
  const updateStoryMap = useProjectStore((s) => s.updateStoryMap);
  const addJourney = useBoardStore((s) => s.addJourney);

  if (!storyMap) {
    return (
      <>
        <Header
          title="Story Map"
          actions={
            <Button variant="ghost" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
              Back
            </Button>
          }
        />
        <Box sx={{ flex: 1, overflow: 'auto', p: 4 }}>
          <EmptyState
            icon="❓"
            title="Story map not found"
            description="This map may have been deleted."
            action={<Button onClick={() => navigate('/')}>Back to dashboard</Button>}
          />
        </Box>
      </>
    );
  }

  return (
    <>
      <Header
        title={
          <InlineEditInput
            value={storyMap.name}
            onSave={(name) => updateStoryMap(storyMap.id, { name })}
            ariaLabel="Story map name"
            sx={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', color: 'text.primary' }}
          />
        }
        actions={
          <>
            <Button variant="ghost" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
              Back
            </Button>
            <Button onClick={() => addJourney(storyMap.id)}>+ Add Journey</Button>
          </>
        }
      />
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'grey.100', p: 3 }}>
        <Box
          sx={{
            minHeight: '100%',
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            p: 3,
            boxShadow: (theme) => theme.customShadows.card,
          }}
        >
          <BoardCanvas mapId={storyMap.id} />
          <ReleasesPanel mapId={storyMap.id} />
        </Box>
      </Box>
      <StoryDrawer />
    </>
  );
}
```

### `src/pages/LoginPage.tsx`
```tsx
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Logo } from '../components/shared/Logo';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

// Standalone sign-in page recreating the Minimals (Amplify) sign-in form.
// Client-side only — submitting navigates to the dashboard. No backend/auth.
export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  // Light, glass-readable styling for the inputs (white text + light borders).
  const fieldSx = {
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.6)' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
    },
    '& .MuiOutlinedInput-input::placeholder': { color: 'rgba(255, 255, 255, 0.5)', opacity: 1 },
    '& .MuiInputAdornment-root .MuiIconButton-root': { color: 'rgba(255, 255, 255, 0.7)' },
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#011022',
        p: 2,
      }}
    >
      {/* Background video */}
      <Box
        component="video"
        src="/waves.mp4"
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          // Keep the video on its own GPU layer so it never throttles when idle.
          transform: 'translateZ(0)',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />

      <Card
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 448,
          p: { xs: 3, sm: 5 },
          // Liquid glass — clearer, less frosted, bright rim + specular highlight
          bgcolor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px) saturate(180%) brightness(1.08)',
          WebkitBackdropFilter: 'blur(10px) saturate(180%) brightness(1.08)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          boxShadow:
            'inset 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -1px 1px rgba(255, 255, 255, 0.15), 0 12px 40px rgba(0, 0, 0, 0.45)',
          transform: 'translateZ(0)',
          // Continuously nudge the blur by an imperceptible amount so the
          // browser never idles (and freezes) the backdrop over the video.
          animation: 'glassKeepAlive 4s ease-in-out infinite alternate',
          '@keyframes glassKeepAlive': {
            from: {
              backdropFilter: 'blur(10px) saturate(180%) brightness(1.08)',
              WebkitBackdropFilter: 'blur(10px) saturate(180%) brightness(1.08)',
            },
            to: {
              backdropFilter: 'blur(10.5px) saturate(180%) brightness(1.08)',
              WebkitBackdropFilter: 'blur(10.5px) saturate(180%) brightness(1.08)',
            },
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 5 }}>
          <Logo variant="white" height={30} />
        </Box>

        {/* Heading */}
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
            Sign in to your account
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.72)' }}>
              Don't have an account?
            </Typography>
            <Link
              component="button"
              type="button"
              variant="subtitle2"
              underline="hover"
              sx={{ color: '#FFB6C1', '&:hover': { color: '#FF9DB2' } }}
            >
              Get started
            </Link>
          </Stack>
        </Stack>

        {/* Form */}
        <Stack component="form" spacing={3} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email address"
            type="email"
            autoComplete="email"
            sx={fieldSx}
          />

          <Stack spacing={1.5}>
            <TextField
              fullWidth
              label="Password"
              placeholder="6+ characters"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              sx={fieldSx}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Link
              component="button"
              type="button"
              variant="body2"
              underline="none"
              sx={{ alignSelf: 'flex-end', color: 'rgba(255, 255, 255, 0.72)' }}
            >
              Forgot password?
            </Link>
          </Stack>

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            sx={{
              minHeight: 48,
              bgcolor: '#fff',
              color: 'text.primary',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.86)' },
            }}
          >
            Sign in
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
```

### Binary/large `public/` assets (carry over as files — not reproducible as text)
- `public/waves.mp4` — login background video (~8 MB). Source: `C:\Users\gaura\Downloads\waves.bn1dM62f.mp4`.
- `public/logo-white.svg` — white "Software Co" wordmark (~1.4 MB). Source: `Group 4.svg`.
- `public/logo-black.svg` — black "Software Co" wordmark (~1.4 MB). Source: `Group 5.svg`.

### Other
- `D:\Storymap\STORY_MAP_PLANNING.md` — original product planning document (still present).

---

## 7. Open Items & Next Steps

**No pending/in-progress task.** Optional follow-ups (not requested):
- **Logo SVGs are ~1.4 MB each** — could be optimized via SVGO or re-exported as flattened paths.
- **Dashboard 4-cards-per-row** may feel narrow on some screens — could cap at 3 or set a min card width.
- **Journeys grid `maxWidth: 760`** — could be made full-width if desired.
- **`hooks/useEscapeKey.ts` and `hooks/useClickOutside.ts` are dead code** — safe to remove.
- **Login page is visual-only** (no validation/loading/real auth). Possible extensions: a mock auth gate (start at `/login`, protected routes, sign-out) or the full split-screen hero panel.
- **Dev server lifecycle:** dies between turns sometimes. If `localhost:5173` is unreachable, run `npm run dev` and confirm port 5173 is listening.

**Standard workflow to continue:** make the change → `npm run build` (must pass) → ensure dev server running (`npm run dev` if not) → tell the user the URL and what changed, briefly.

---

## 8. Key Terms & Shorthand

- **StoryMap** — the app/product name (User Story Mapping tool).
- **Project → Story Map → (Journeys → Steps) + (Releases → Stories → Story details)** — the entity hierarchy.
- **Journey** — column with a green header; contains **Steps**. Step display number `journeyIndex+1.stepIndex` (e.g. `1.0`, `2.1`), derived not stored.
- **Release** — a band (blue/secondary accent) containing **Stories**; stories stack vertically at 320px wide.
- **Story details drawer** — right-side MUI Drawer for a story (title, attachments, description, comments).
- **Board / BoardCanvas** — the story map board (journeys in a 2-column grid).
- **`storymap-data` / `storymap-board`** — the two localStorage keys for the two Zustand stores.
- **customShadows** — custom theme key (`theme.customShadows.{z1,z8,z12,z16,z24,card,dialog,dropdown,primary,secondary,error}`).
- **Minimal / Minimals / Minimal_Web** — the Figma design system (the Minimals MUI admin template) used as styling source of truth. Figma file key `RJJDzj9SvaQG43EYkNMa0o`. Key node ids: Colors `0:2627`, Typography `399:52624`, Shadows `0:2407`, Search field `5796:133417`.
- **Liquid glass** — the login card style (translucent + blur + bright rim + specular highlight).
- **"Software Co"** — the user's logo wordmark; provided as `Group 4.svg` (white) and `Group 5.svg` (black).
- **Primary = green `#00AB55`**, **Secondary = blue `#3366FF`** (Minimals palette). Grey channel `145, 158, 171` (Grey/500 `#919EAB`) drives shadows/dividers. Login base color **`#011022`**. "Get started" link **`#FFB6C1`** (light pink).
- **Public Sans** — the app font.
- **MUI v9 gotchas:** color-specific Button slots removed (use `variants`); `PaperProps`→`slotProps.paper`; `Stack` `alignItems` shorthand rejected (use `sx`).
- **API-preserving wrappers** — migration pattern: shared components keep their original props but render MUI internally.

---
---

# StoryMap — Continuation Handoff (Session 2)

> Everything below was added in a later session. The sections above remain accurate **except where explicitly noted here** (this session changed the board layout, the Story drawer, routing, the data model, and removed some files). When in conflict, **this Session-2 section wins.**

## S2.1 Purpose & Goal (update)

Same product (StoryMap — offline-first User Story Mapping tool). This session was **UI/UX refinement + a board redesign + a Figma "Story Details" modal + perf cleanup + navigation changes**. All requested work is **complete**; app **builds cleanly** (`npm run build`) and runs at **http://localhost:5173/**. No in-progress task. Only an *offered, not-yet-approved* `React.memo` perf optimization remains open.

## S2.2 Background & Context (new/changed since the original)

- **Fake auth gate added.** New `src/lib/auth.ts` holds an in-memory `signedIn` flag (resets on full page load). App always opens at `/login`; "Sign in" sets the flag and navigates to `/`. A `RequireAuth` wrapper in `App.tsx` redirects to `/login` when not signed in. Unknown routes → `/login`. **A page refresh on any app screen returns you to `/login` (by design).**
- **Routing changed.** `/` (dashboard) renders inside `AppLayout` (sidebar shell). **`/board/:mapId` now renders inside a new `BoardLayout` (full-screen, NO sidebar)**. Both behind `RequireAuth`.
- **Data model changed.** `Story` gained **`stepId: string`** — each story belongs to a step column. `useBoardStore` persist **`version` bumped 1 → 2** with a `migrate` that backfills `stepId` (places legacy stories under the first step of their map). `addStory` signature is now `addStory(releaseId, stepId, mapId)`. `deleteStep` cascades its stories; `deleteJourney` cascades steps **and** their stories.
- **Board layout overhauled** to the canonical 2-D story-map grid: journeys backbone scrolls horizontally; **each journey expands to fit its steps laid out horizontally**; under each release band, **stories sit in columns aligned directly under their step** (driven by `stepId`). Shared sizing constants live in `src/components/board/boardLayout.ts` (200×100 boxes).
- **Story drawer replaced by a centered Figma modal** ("Story Details"). **Comments were removed** from this view (per user choice). Description uses a **visual-only rich-text toolbar** over a plain-text area (no rich-text library added).
- **Dead code removed** (perf/cleanup): deleted `CommentSection.tsx`, `useEscapeKey.ts`, `useClickOutside.ts`; removed `addComment` (boardStore), `formatRelativeTime` (dateFormat), `STORAGE_LIMIT_BYTES` (storage). All `transition: 'all'` replaced with explicit property lists.
- **Login page:** briefly changed to a static image bg then **rolled back** — it is back to the original `waves.mp4` video + `#011022` + glass keep-alive animation. The only net change vs. the original is `LoginPage` now calls `signIn()` in `handleSubmit`. `public/waves.mp4` is still used.
- **New file `.claude/launch.json`** defines a Claude Preview server named `storymap` on port 5173.
- **Preview tooling quirks:** the Claude Preview viewport defaults to ~44px wide (collapses `vw` widths — resize to e.g. 1440×900 before measuring); `preview_screenshot` frequently times out — verify via `preview_eval` DOM measurements instead. Auth flag resets on preview reload, so re-click "Sign in" and the map card to get back to a board.

## S2.3 About Me (additional learnings)

- Works visually and incrementally; sends screenshots with red circles/arrows to point at the target. Often issues one focused change at a time, reviews, then iterates.
- Will reverse a just-made change after seeing it (e.g., asked to swap the login video for an image, then immediately "roll back… don't want to change the BG"). Don't over-invest before showing the result.
- Casual tone, minor typos (e.g., "over effects" = hover effects; "tear boxes" = "their boxes"). Interpret intent generously.
- Cares about pixel-level fidelity to Figma and exact dimensions ("exact same width, height").
- Expects the full loop: make change → `npm run build` → ensure dev server is up → report briefly with the URL.
- Frames perf fixes as "remove unnecessary code"; the real goal is "make it not laggy/jerky."

## S2.4 Decisions Made (this session, with reasoning)

1. **Auth gate is in-memory only** (resets each load) — user explicitly wanted "login first every time," so no `sessionStorage`/persistence. Offered to persist for the session; user kept in-memory.
2. **Board = single horizontal scroll**, not a 2-column grid. Journeys sit side-by-side; **steps lay out horizontally inside each journey and the journey expands to fit them** (no inner step scroll). User corrected an earlier "scroll inside one journey" attempt — wanted journeys to expand instead.
3. **Journey header kept as the green pill, fixed to one step width** (200px) — user said "keep the current one" when offered the Figma backbone style. Whitespace appears to its right.
4. **Stories align in columns under steps** via a new `Story.stepId`. Approved by user ("Yes"). Migration backfills legacy stories to the map's first step; orphan stories (step deleted) render in a trailing **"Unassigned"** column at 200×100 so nothing vanishes/stretches.
5. **Uniform box size = 200×100 px** for step cards and story cards (user-specified exact numbers). Shared via `boardLayout.ts` constants.
6. **`BOARD_INSET` (16px) applied to BOTH the backbone and release grid** so the first column isn't flush against the band edge while staying aligned with the steps.
7. **"+ Add Step" replaced by a hover "+"** on the **last** step only (not every step). Empty journeys still show a dashed "+ Add Step" tile (200×100) to create the first step.
8. **"+ Add Journey" = a 32×32 plus-only tile** at the end of the backbone (text removed).
9. **"+ Add Story" appears only on hover** of its step column (opacity 0 → 1), not permanently.
10. **Back button moved to the LEFT of the board title** (Header gained a `leading` slot); only "+ Add Journey" stays on the right.
11. **Board opens full-screen (no projects sidebar)** — new `BoardLayout`. It still mounts `ConfirmDeleteModal` so board deletes keep working (verified).
12. **Story Details = centered modal recreated from Figma** (`sKsAuLWUzZPECcbFCKChUm`, node `3904:3814`): 1011×837, 24px padding, 16px radius, exact shadow; "Story Details" header + rounded close-square; big editable title; Description editor (419px: 42px toolbar w/ bottom border + content, placeholder "Write something awesome..."); "Images" upload dropzone (dashed `rgba(145,158,171,0.48)`, fill `rgba(145,158,171,0.08)`, radius 12, cloud icon + "Upload file"); green "Save Changes" (px16/py6, radius 8) bottom-right.
13. **Comments removed** from the Story view (user chose "Remove (match Figma)").
14. **Description editor is visual-only** (user chose "Visual toolbar + plain text") — no Tiptap/rich-text dependency; toolbar icons are decorative; editing is plain text; "Save Changes" commits description and closes; title saves instantly; attachments save immediately; discard-confirm if closing with unsaved description.
15. **InlineEditInput restyled** — the bright green neon outline in edit mode replaced with a light-gray text-field look (grey.100 fill, divider border, subtle focus ring).
16. **Perf:** removed dead code; replaced every `transition: 'all'` with explicit transitions. Left the login `glassKeepAlive` backdrop-filter animation in place (login-only; needed to prevent video freeze).

## S2.5 Current State

- Builds cleanly; dev server at **http://localhost:5173/** (restart via `npm run dev` or the Claude Preview `storymap` config if down).
- **Login** (`/login`): unchanged visuals (waves video, glass card) + `signIn()` on submit.
- **Dashboard** (`/`, inside `AppLayout` with sidebar): unchanged from original handoff.
- **Board** (`/board/:mapId`, inside `BoardLayout`, full-screen): Header = Back (left) + editable map title + "+ Add Journey" (right). White container grows to `max-content` width; backbone (journeys + horizontal steps, 200×100) and release bands share one horizontal scroll and stay column-aligned. Hover "+" adds a step (last step) / a story (per column). Releases panel: dashed "+ Add Release" line + stacked bands; each band = full-width header (name + story count) over a grey grid of step-aligned 200×100 story columns + "Unassigned" fallback.
- **Story Details modal**: as described in decision 12–14. Verified at 1440×900 preview (1011×839 ≈ Figma 1011×837, centered, columns aligned, 200×100 cards).
- **Deleted files:** `src/components/drawer/CommentSection.tsx`, `src/hooks/useEscapeKey.ts`, `src/hooks/useClickOutside.ts` (the `src/hooks/` folder is now empty).
- **Stray asset:** `D:\Storymap\figma_node.png` was downloaded for inspection and then deleted. `public/login-bg.png` is referenced by NO code (the login image change was rolled back).

## S2.6 Artifacts & Deliverables (full current source of NEW + CHANGED files)

> Files **not listed here are unchanged** from the original handoff sections above (theme, main.tsx, idgen.ts, projectStore.ts, AppLayout.tsx, Sidebar.tsx, all `shared/*` except InlineEditInput, all `modals/*`, DashboardPage.tsx, StoryMapCard.tsx, all config files, index.html, index.css). The three deleted files above should be **removed** in the new workspace.

### NEW: `.claude/launch.json`
```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "storymap",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 5173
    }
  ]
}
```

### NEW: `src/lib/auth.ts`
```ts
import { useSyncExternalStore } from 'react';

// Lightweight, in-memory "auth" flag — no backend, no persistence.
// It resets on every full page load, so opening the app always starts at
// /login until the user signs in (then routing allows the dashboard).

let signedIn = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function signIn() {
  signedIn = true;
  emit();
}

export function signOut() {
  signedIn = false;
  emit();
}

// React hook to read the current sign-in state.
export function useIsSignedIn(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => signedIn,
    () => signedIn
  );
}
```

### NEW: `src/components/board/boardLayout.ts`
```ts
// Shared layout constants for the story-map board so the backbone (journeys +
// steps) and the release rows (stories) line up into the same column grid.
// Both the steps and the stories use COLUMN_WIDTH × CARD_HEIGHT boxes, and the
// same horizontal gaps, so every story sits directly under its step.

export const COLUMN_WIDTH = 200; // px — width of a step / story box
export const CARD_HEIGHT = 100; // px — height of a step / story box
export const STEP_GAP = 1; // theme spacing (8px) between columns within a journey
export const JOURNEY_GAP = 3; // theme spacing (24px) between journeys
// Left inset applied to BOTH the backbone and the release grid so the first
// column isn't flush against the edge — applied equally to keep them aligned.
export const BOARD_INSET = 2; // theme spacing (16px)
```

### NEW: `src/components/layout/BoardLayout.tsx`
```tsx
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';

// Full-screen layout for the story map board — no projects sidebar.
// Still mounts the shared delete-confirmation modal so board deletes
// (journeys, steps, releases, stories) keep working.
export function BoardLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'grey.100',
      }}
    >
      <Outlet />
      <ConfirmDeleteModal />
    </Box>
  );
}
```

### CHANGED: `src/App.tsx`
```tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { BoardLayout } from './components/layout/BoardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { StoryMapBoardPage } from './pages/StoryMapBoardPage';
import { LoginPage } from './pages/LoginPage';
import { useIsSignedIn } from './lib/auth';

// Gate for the app shell — redirects to /login until the user has signed in.
function RequireAuth() {
  const signedIn = useIsSignedIn();
  return signedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone auth page — rendered without the app shell. */}
        <Route path="/login" element={<LoginPage />} />

        {/* All app pages require sign-in. The dashboard renders inside the
            AppLayout shell (sidebar); the board opens full-screen on its own. */}
        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
          </Route>
          <Route element={<BoardLayout />}>
            <Route path="/board/:mapId" element={<StoryMapBoardPage />} />
          </Route>
        </Route>

        {/* Anything else → login. */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### CHANGED: `src/types/index.ts`
```ts
// Core TypeScript interfaces for StoryMap.
// These mirror the data model in the planning document (§8).
// Only the entities needed for the base setup are filled in now;
// board entities (Journey, Step, Release, Story) will be added later.

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string; // ISO date string
}

export interface StoryMap {
  id: string;
  projectId: string;
  name: string;
  createdAt: string; // ISO date string
  createdBy: string; // hardcoded "You" for MVP (no auth)
  // Counts are derived from the board store (not stored here) — see StoryMapCard.
}

// ─── Board entities ─────────────────────────────────────────────

export interface Journey {
  id: string;
  mapId: string;
  title: string;
  order: number; // display order across the board
}

export interface Step {
  id: string;
  journeyId: string;
  mapId: string; // denormalized for easy "all steps for map X" queries
  title: string;
  order: number; // order within its journey
  // Display number ("1.0") is derived: journeyIndex.stepOrder — never stored.
}

export interface Release {
  id: string;
  mapId: string;
  name: string;
  order: number; // vertical stacking order
}

export interface Story {
  id: string;
  releaseId: string;
  stepId: string; // which step column this story sits under (grid alignment)
  mapId: string; // denormalized
  title: string;
  description: string;
  order: number; // within its release + step column
  attachments: Attachment[];
  comments: Comment[];
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string; // MIME type
  dataUrl: string; // base64 data URL
  uploadedAt: string;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

// ─── Delete confirmation target ─────────────────────────────────

export type DeleteTargetType =
  | 'project'
  | 'storyMap'
  | 'journey'
  | 'step'
  | 'release'
  | 'story';

export interface DeleteTarget {
  type: DeleteTargetType;
  id: string;
  label: string; // shown in the modal, e.g. "Delete journey "Onboarding"?"
}
```

### CHANGED: `src/store/boardStore.ts`
```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Journey, Step, Release, Story, Attachment } from '../types';
import { generateId } from '../lib/idgen';
import { seedJourneys, seedSteps, seedReleases, seedStories } from './seed';

interface BoardState {
  // Flat arrays, relations by id (per planning doc §8).
  journeys: Journey[];
  steps: Step[];
  releases: Release[];
  stories: Story[];

  // ─── UI state (not persisted) ─────────────────────
  activeStoryId: string | null;
  openStoryDrawer: (id: string) => void;
  closeStoryDrawer: () => void;

  // ─── Journey actions ──────────────────────────────
  addJourney: (mapId: string) => void;
  updateJourney: (id: string, patch: Partial<Pick<Journey, 'title'>>) => void;
  deleteJourney: (id: string) => void; // cascades its steps

  // ─── Step actions ─────────────────────────────────
  addStep: (journeyId: string, mapId: string) => void;
  updateStep: (id: string, patch: Partial<Pick<Step, 'title'>>) => void;
  deleteStep: (id: string) => void; // cascades its stories (same column)

  // ─── Release actions ──────────────────────────────
  addRelease: (mapId: string) => void;
  updateRelease: (id: string, patch: Partial<Pick<Release, 'name'>>) => void;
  deleteRelease: (id: string) => void; // cascades its stories

  // ─── Story actions ────────────────────────────────
  addStory: (releaseId: string, stepId: string, mapId: string) => void;
  updateStory: (id: string, patch: Partial<Pick<Story, 'title' | 'description'>>) => void;
  deleteStory: (id: string) => void;
  addAttachment: (storyId: string, attachment: Attachment) => void;
  deleteAttachment: (storyId: string, attachmentId: string) => void;

  // ─── Cross-store cascade ──────────────────────────
  // Removes all board rows for a map (called when a map/project is deleted).
  deleteMapData: (mapId: string) => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      journeys: seedJourneys,
      steps: seedSteps,
      releases: seedReleases,
      stories: seedStories,

      activeStoryId: null,
      openStoryDrawer: (id) => set({ activeStoryId: id }),
      closeStoryDrawer: () => set({ activeStoryId: null }),

      addJourney: (mapId) =>
        set((state) => {
          const order = state.journeys.filter((j) => j.mapId === mapId).length;
          const journey: Journey = {
            id: generateId(),
            mapId,
            title: 'New Journey',
            order,
          };
          return { journeys: [...state.journeys, journey] };
        }),

      updateJourney: (id, patch) =>
        set((state) => ({
          journeys: state.journeys.map((j) => (j.id === id ? { ...j, ...patch } : j)),
        })),

      deleteJourney: (id) =>
        set((state) => {
          const removedStepIds = new Set(
            state.steps.filter((s) => s.journeyId === id).map((s) => s.id)
          );
          return {
            journeys: state.journeys.filter((j) => j.id !== id),
            steps: state.steps.filter((s) => s.journeyId !== id), // cascade steps
            stories: state.stories.filter((s) => !removedStepIds.has(s.stepId)), // + their stories
          };
        }),

      addStep: (journeyId, mapId) =>
        set((state) => {
          const order = state.steps.filter((s) => s.journeyId === journeyId).length;
          const step: Step = {
            id: generateId(),
            journeyId,
            mapId,
            title: 'Untitled Step',
            order,
          };
          return { steps: [...state.steps, step] };
        }),

      updateStep: (id, patch) =>
        set((state) => ({
          steps: state.steps.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),

      deleteStep: (id) =>
        set((state) => ({
          steps: state.steps.filter((s) => s.id !== id),
          stories: state.stories.filter((s) => s.stepId !== id), // cascade column's stories
        })),

      addRelease: (mapId) =>
        set((state) => {
          const count = state.releases.filter((r) => r.mapId === mapId).length;
          const release: Release = {
            id: generateId(),
            mapId,
            name: `Release ${count + 1}`,
            order: count,
          };
          return { releases: [...state.releases, release] };
        }),

      updateRelease: (id, patch) =>
        set((state) => ({
          releases: state.releases.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),

      deleteRelease: (id) =>
        set((state) => ({
          releases: state.releases.filter((r) => r.id !== id),
          stories: state.stories.filter((s) => s.releaseId !== id), // cascade
        })),

      addStory: (releaseId, stepId, mapId) =>
        set((state) => {
          // Order within the release + step column (the grid cell).
          const order = state.stories.filter(
            (s) => s.releaseId === releaseId && s.stepId === stepId
          ).length;
          const story: Story = {
            id: generateId(),
            releaseId,
            stepId,
            mapId,
            title: 'Untitled Story',
            description: '',
            order,
            attachments: [],
            comments: [],
            createdAt: new Date().toISOString(),
          };
          return { stories: [...state.stories, story] };
        }),

      updateStory: (id, patch) =>
        set((state) => ({
          stories: state.stories.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),

      deleteStory: (id) =>
        set((state) => ({ stories: state.stories.filter((s) => s.id !== id) })),

      addAttachment: (storyId, attachment) =>
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === storyId ? { ...s, attachments: [...s.attachments, attachment] } : s
          ),
        })),

      deleteAttachment: (storyId, attachmentId) =>
        set((state) => ({
          stories: state.stories.map((s) =>
            s.id === storyId
              ? { ...s, attachments: s.attachments.filter((a) => a.id !== attachmentId) }
              : s
          ),
        })),

      deleteMapData: (mapId) =>
        set((state) => ({
          journeys: state.journeys.filter((j) => j.mapId !== mapId),
          steps: state.steps.filter((s) => s.mapId !== mapId),
          releases: state.releases.filter((r) => r.mapId !== mapId),
          stories: state.stories.filter((s) => s.mapId !== mapId),
        })),
    }),
    {
      name: 'storymap-board',
      version: 2,
      // Run on load when the persisted version is older than `version`.
      // v1 → v2: stories gained a `stepId`. Backfill any pre-existing story by
      // placing it under the first step of its map so old boards still render.
      migrate: (persisted) => {
        const state = persisted as BoardState;
        if (state && Array.isArray(state.stories) && Array.isArray(state.steps)) {
          const firstStepOfMap = (mapId: string) =>
            state.steps
              .filter((s) => s.mapId === mapId)
              .sort((a, b) => a.order - b.order)[0]?.id ?? '';
          state.stories = state.stories.map((s) =>
            s.stepId ? s : { ...s, stepId: firstStepOfMap(s.mapId) }
          );
        }
        return state;
      },
      partialize: (state) => ({
        journeys: state.journeys,
        steps: state.steps,
        releases: state.releases,
        stories: state.stories,
      }),
    }
  )
);
```

### CHANGED: `src/store/seed.ts`
```ts
import type { Project, StoryMap, Journey, Step, Release, Story } from '../types';

// Sample data used to populate the store on first load (when localStorage
// is empty). Realistic but simple — enough to see the UI with content.

export const seedProjects: Project[] = [
  {
    id: 'proj-mobile-banking',
    name: 'Mobile Banking App',
    description: 'Consumer banking app — onboarding, payments, and account management.',
    createdAt: '2026-05-02T09:00:00.000Z',
  },
  {
    id: 'proj-marketplace',
    name: 'Artisan Marketplace',
    description: 'Two-sided marketplace connecting local makers with buyers.',
    createdAt: '2026-05-18T14:30:00.000Z',
  },
  {
    id: 'proj-fitness',
    name: 'Fitness Tracker',
    description: 'Habit and workout tracking with weekly progress summaries.',
    createdAt: '2026-06-01T08:15:00.000Z',
  },
];

export const seedStoryMaps: StoryMap[] = [
  {
    id: 'map-onboarding',
    projectId: 'proj-mobile-banking',
    name: 'Onboarding & KYC Flow',
    createdAt: '2026-05-03T10:00:00.000Z',
    createdBy: 'You',
  },
  {
    id: 'map-payments',
    projectId: 'proj-mobile-banking',
    name: 'Payments & Transfers',
    createdAt: '2026-05-10T11:20:00.000Z',
    createdBy: 'You',
  },
  {
    id: 'map-seller',
    projectId: 'proj-marketplace',
    name: 'Seller Onboarding',
    createdAt: '2026-05-19T16:00:00.000Z',
    createdBy: 'You',
  },
  {
    id: 'map-checkout',
    projectId: 'proj-marketplace',
    name: 'Buyer Checkout',
    createdAt: '2026-05-25T13:45:00.000Z',
    createdBy: 'You',
  },
  {
    id: 'map-workout',
    projectId: 'proj-fitness',
    name: 'Workout Logging',
    createdAt: '2026-06-02T09:30:00.000Z',
    createdBy: 'You',
  },
];

// ─── Seed board data (for "Onboarding & KYC Flow") ───────────────
// Gives the first map real content so its dashboard counts are non-zero
// and opening it shows a populated board. Other maps start empty.

const MAP = 'map-onboarding';

export const seedJourneys: Journey[] = [
  { id: 'jny-discover', mapId: MAP, title: 'Discover', order: 0 },
  { id: 'jny-signup', mapId: MAP, title: 'Sign Up', order: 1 },
  { id: 'jny-verify', mapId: MAP, title: 'Verify Identity', order: 2 },
  { id: 'jny-start', mapId: MAP, title: 'Get Started', order: 3 },
];

export const seedSteps: Step[] = [
  { id: 'stp-1', journeyId: 'jny-discover', mapId: MAP, title: 'Land on website', order: 0 },
  { id: 'stp-2', journeyId: 'jny-discover', mapId: MAP, title: 'Compare plans', order: 1 },
  { id: 'stp-3', journeyId: 'jny-signup', mapId: MAP, title: 'Enter email', order: 0 },
  { id: 'stp-4', journeyId: 'jny-signup', mapId: MAP, title: 'Create password', order: 1 },
  { id: 'stp-5', journeyId: 'jny-signup', mapId: MAP, title: 'Accept terms', order: 2 },
  { id: 'stp-6', journeyId: 'jny-verify', mapId: MAP, title: 'Upload ID', order: 0 },
  { id: 'stp-7', journeyId: 'jny-verify', mapId: MAP, title: 'Take a selfie', order: 1 },
  { id: 'stp-8', journeyId: 'jny-verify', mapId: MAP, title: 'Await approval', order: 2 },
  { id: 'stp-9', journeyId: 'jny-start', mapId: MAP, title: 'Link first account', order: 0 },
  { id: 'stp-10', journeyId: 'jny-start', mapId: MAP, title: 'Tour the dashboard', order: 1 },
];

export const seedReleases: Release[] = [
  { id: 'rel-mvp', mapId: MAP, name: 'Release 1 — MVP', order: 0 },
  { id: 'rel-fast', mapId: MAP, name: 'Release 2 — Fast Follow', order: 1 },
];

const story = (
  id: string,
  releaseId: string,
  stepId: string,
  title: string,
  order: number
): Story => ({
  id,
  releaseId,
  stepId,
  mapId: MAP,
  title,
  description: '',
  order,
  attachments: [],
  comments: [],
  createdAt: '2026-05-03T10:00:00.000Z',
});

export const seedStories: Story[] = [
  story('sty-1', 'rel-mvp', 'stp-3', 'Email + password sign up', 0),
  story('sty-2', 'rel-mvp', 'stp-6', 'Basic ID upload', 0),
  story('sty-3', 'rel-mvp', 'stp-8', 'Manual approval queue', 0),
  story('sty-4', 'rel-fast', 'stp-7', 'Selfie liveness check', 0),
  story('sty-5', 'rel-fast', 'stp-8', 'Auto-approval for low risk', 0),
];
```

### CHANGED: `src/lib/dateFormat.ts`
```ts
// Consistent, human-readable date formatting across the app.
// Example: "Jun 10, 2026"
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
```

### CHANGED: `src/lib/storage.ts`
```ts
// localStorage size helpers used to warn the user before they hit the
// browser's ~5MB origin limit (base64 attachments are the main risk).

export const STORAGE_WARN_BYTES = 4 * 1024 * 1024; // soft warning threshold
export const ATTACHMENT_WARN_BYTES = 1 * 1024 * 1024; // per-file warning

// Approximate bytes currently used by this origin's localStorage.
// Uses UTF-16 (2 bytes/char), matching how browsers store strings.
export function getStorageUsageBytes(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const value = localStorage.getItem(key) ?? '';
    total += (key.length + value.length) * 2;
  }
  return total;
}

export function isStorageNearlyFull(): boolean {
  return getStorageUsageBytes() >= STORAGE_WARN_BYTES;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
```

### CHANGED: `src/components/layout/Header.tsx`
```tsx
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface HeaderProps {
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
  /** Optional element rendered before the title (e.g. a back arrow). */
  leading?: ReactNode;
}

// Reusable top header area for pages.
export function Header({ title, subtitle, actions, leading }: HeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 4,
        py: 2.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
        {leading && <Box sx={{ flexShrink: 0 }}>{leading}</Box>}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            component="h1"
            noWrap
            sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.25 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      {actions && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>{actions}</Box>
      )}
    </Box>
  );
}
```

### CHANGED: `src/components/board/BoardCanvas.tsx`
```tsx
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import AddIcon from '@mui/icons-material/Add';
import { useBoardStore } from '../../store/boardStore';
import { JourneyColumn } from './JourneyColumn';
import { EmptyState } from '../shared/EmptyState';
import { Button } from '../shared/Button';
import { JOURNEY_GAP, BOARD_INSET } from './boardLayout';

interface BoardCanvasProps {
  mapId: string;
}

// Canvas holding journeys in a single horizontally-scrollable row.
export function BoardCanvas({ mapId }: BoardCanvasProps) {
  const journeys = useBoardStore((s) => s.journeys);
  const addJourney = useBoardStore((s) => s.addJourney);

  const mapJourneys = journeys
    .filter((j) => j.mapId === mapId)
    .sort((a, b) => a.order - b.order);

  if (mapJourneys.length === 0) {
    return (
      <EmptyState
        icon="🧭"
        title="Let's get started"
        description="Add your first journey to begin mapping out steps."
        action={<Button onClick={() => addJourney(mapId)}>+ Add Journey</Button>}
      />
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: JOURNEY_GAP,
        pl: BOARD_INSET,
      }}
    >
      {mapJourneys.map((journey, index) => (
        <Box key={journey.id} sx={{ flexShrink: 0 }}>
          <JourneyColumn journey={journey} index={index} />
        </Box>
      ))}

      {/* Add journey cell — compact plus-only tile */}
      <ButtonBase
        onClick={() => addJourney(mapId)}
        aria-label="Add Journey"
        sx={{
          flexShrink: 0,
          width: 32,
          height: 32,
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'grey.300',
          color: 'text.disabled',
          transition: 'border-color 0.2s, background-color 0.2s, color 0.2s',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter', color: 'primary.main' },
        }}
      >
        <AddIcon fontSize="small" />
      </ButtonBase>
    </Box>
  );
}
```

### CHANGED: `src/components/board/JourneyColumn.tsx`
```tsx
import { useRef } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import type { Journey } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { useProjectStore } from '../../store/projectStore';
import { InlineEditInput, type InlineEditHandle } from '../shared/InlineEditInput';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';
import { StepCard } from './StepCard';
import { COLUMN_WIDTH, CARD_HEIGHT, STEP_GAP } from './boardLayout';

interface JourneyColumnProps {
  journey: Journey;
  /** Zero-based position of this journey on the board (for step numbering). */
  index: number;
}

const dashedButtonSx = {
  borderRadius: 2,
  border: '1px dashed',
  borderColor: 'grey.300',
  py: 1.25,
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
  color: 'text.disabled',
  transition: 'border-color 0.2s, background-color 0.2s, color 0.2s',
  '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter', color: 'primary.main' },
};

export function JourneyColumn({ journey, index }: JourneyColumnProps) {
  const updateJourney = useBoardStore((s) => s.updateJourney);
  const addStep = useBoardStore((s) => s.addStep);
  const steps = useBoardStore((s) => s.steps);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);
  const titleRef = useRef<InlineEditHandle>(null);

  const journeySteps = steps
    .filter((s) => s.journeyId === journey.id)
    .sort((a, b) => a.order - b.order);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5, width: 'fit-content' }}>
      {/* Journey header — sized to one step width; whitespace beyond it. */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          width: COLUMN_WIDTH,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          px: 1.75,
          py: 1.25,
          boxShadow: 1,
        }}
      >
        <Box component="span" sx={{ minWidth: 0, flex: 1 }}>
          <InlineEditInput
            ref={titleRef}
            value={journey.title}
            onSave={(title) => updateJourney(journey.id, { title })}
            ariaLabel="Journey title"
            sx={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'common.white' }}
          />
        </Box>
        <ThreeDotMenu
          triggerSx={{ color: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' } }}
          onRename={() => titleRef.current?.beginEdit()}
          onDelete={() =>
            setConfirmDeleteTarget({
              type: 'journey',
              id: journey.id,
              label: `Delete journey “${journey.title}” and its steps?`,
            })
          }
        />
      </Box>

      {/* Steps — horizontal row; the journey expands to fit all its steps.
          With no steps yet, show the dashed "Add Step" tile so the first step
          can be created. Once steps exist, new steps are added via the "+"
          affordance that appears when hovering a step's right edge. */}
      {journeySteps.length === 0 ? (
        <ButtonBase
          onClick={() => addStep(journey.id, journey.mapId)}
          sx={{ ...dashedButtonSx, width: COLUMN_WIDTH, height: CARD_HEIGHT }}
        >
          + Add Step
        </ButtonBase>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: STEP_GAP }}>
          {journeySteps.map((step, stepIndex) => {
            const isLast = stepIndex === journeySteps.length - 1;
            return (
              <Box
                key={step.id}
                sx={{
                  position: 'relative',
                  flex: `0 0 ${COLUMN_WIDTH}px`,
                  width: COLUMN_WIDTH,
                  ...(isLast && {
                    '&:hover .add-step-affordance': { opacity: 1, pointerEvents: 'auto' },
                  }),
                }}
              >
                <StepCard step={step} number={`${index + 1}.${stepIndex}`} />
                {isLast && (
                  <IconButton
                    className="add-step-affordance"
                    size="small"
                    aria-label="Add step"
                    onClick={() => addStep(journey.id, journey.mapId)}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      right: -18,
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      width: 26,
                      height: 26,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      boxShadow: 2,
                      opacity: 0,
                      pointerEvents: 'none',
                      transition: 'opacity 0.15s',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
```

### CHANGED: `src/components/board/StepCard.tsx`
```tsx
import { useRef } from 'react';
import Box from '@mui/material/Box';
import type { Step } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { useProjectStore } from '../../store/projectStore';
import { InlineEditInput, type InlineEditHandle } from '../shared/InlineEditInput';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';
import { CARD_HEIGHT } from './boardLayout';

interface StepCardProps {
  step: Step;
  /** Derived display number, e.g. "1.0". */
  number: string;
}

// White card with a blue top border, a small number badge, and an
// inline-editable title.
export function StepCard({ step, number }: StepCardProps) {
  const updateStep = useBoardStore((s) => s.updateStep);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);
  const titleRef = useRef<InlineEditHandle>(null);

  return (
    <Box
      sx={{
        height: CARD_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderTop: '3px solid',
        borderTopColor: 'primary.main',
        bgcolor: 'background.paper',
        p: 1.5,
        boxShadow: (theme) => theme.customShadows.z1,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: (theme) => theme.customShadows.z16 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 0.5 }}>
        <Box
          component="span"
          sx={{
            display: 'inline-block',
            borderRadius: 1,
            bgcolor: 'primary.lighter',
            color: 'primary.dark',
            px: 0.75,
            py: 0.25,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {number}
        </Box>
        <ThreeDotMenu
          onRename={() => titleRef.current?.beginEdit()}
          onDelete={() =>
            setConfirmDeleteTarget({ type: 'step', id: step.id, label: `Delete step “${step.title}”?` })
          }
        />
      </Box>
      <InlineEditInput
        ref={titleRef}
        value={step.title}
        onSave={(title) => updateStep(step.id, { title })}
        ariaLabel="Step title"
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          mt: 0.5,
          fontSize: 14,
          fontWeight: 500,
          color: 'text.primary',
        }}
      />
    </Box>
  );
}
```

### CHANGED: `src/components/board/StoryCard.tsx`
```tsx
import { useRef } from 'react';
import Box from '@mui/material/Box';
import type { Story } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { useProjectStore } from '../../store/projectStore';
import { InlineEditInput, type InlineEditHandle } from '../shared/InlineEditInput';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';
import { CARD_HEIGHT } from './boardLayout';

interface StoryCardProps {
  story: Story;
}

// White card with a pink top border. Clicking the card opens the details
// drawer; clicking the title edits it inline (without opening the drawer).
export function StoryCard({ story }: StoryCardProps) {
  const updateStory = useBoardStore((s) => s.updateStory);
  const openStoryDrawer = useBoardStore((s) => s.openStoryDrawer);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);
  const titleRef = useRef<InlineEditHandle>(null);

  const open = () => openStoryDrawer(story.id);

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      sx={{
        height: CARD_HEIGHT,
        width: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderTop: '3px solid',
        borderTopColor: 'secondary.main',
        bgcolor: 'background.paper',
        p: 1.25,
        boxShadow: (theme) => theme.customShadows.z1,
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: 'secondary.light',
          boxShadow: (theme) => theme.customShadows.z16,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
        {/* Stop propagation so editing the title doesn't open the drawer. */}
        <Box component="span" sx={{ flex: 1, minWidth: 0 }} onClick={(e) => e.stopPropagation()}>
          <InlineEditInput
            ref={titleRef}
            value={story.title}
            onSave={(title) => updateStory(story.id, { title })}
            ariaLabel="Story title"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: 14,
              fontWeight: 500,
              color: 'text.primary',
            }}
          />
        </Box>
        <ThreeDotMenu
          onRename={() => titleRef.current?.beginEdit()}
          onDelete={() =>
            setConfirmDeleteTarget({ type: 'story', id: story.id, label: `Delete story “${story.title}”?` })
          }
        />
      </Box>
    </Box>
  );
}
```

### CHANGED (rewritten): `src/components/board/ReleaseSection.tsx`
```tsx
import { useRef } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import type { Journey, Release, Step } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { useProjectStore } from '../../store/projectStore';
import { InlineEditInput, type InlineEditHandle } from '../shared/InlineEditInput';
import { ThreeDotMenu } from '../shared/ThreeDotMenu';
import { Badge } from '../shared/Badge';
import { StoryCard } from './StoryCard';
import { COLUMN_WIDTH, STEP_GAP, JOURNEY_GAP, BOARD_INSET } from './boardLayout';

interface ReleaseSectionProps {
  release: Release;
  /** Backbone columns (journeys → ordered steps) — the grid this release fills. */
  columns: { journey: Journey; steps: Step[] }[];
}

// A release band. Stories are arranged into columns that line up with the
// step backbone above: each story sits under the step it belongs to.
export function ReleaseSection({ release, columns }: ReleaseSectionProps) {
  const updateRelease = useBoardStore((s) => s.updateRelease);
  const addStory = useBoardStore((s) => s.addStory);
  const stories = useBoardStore((s) => s.stories);
  const setConfirmDeleteTarget = useProjectStore((s) => s.setConfirmDeleteTarget);
  const titleRef = useRef<InlineEditHandle>(null);

  const releaseStories = stories.filter((s) => s.releaseId === release.id);
  const storyCount = releaseStories.length;

  const storiesForStep = (stepId: string) =>
    releaseStories.filter((s) => s.stepId === stepId).sort((a, b) => a.order - b.order);

  // Stories whose step was deleted/renamed away — keep them visible (at the
  // same 200×100 size) in a trailing "Unassigned" column rather than dropping
  // or stretching them.
  const validStepIds = new Set(columns.flatMap((c) => c.steps.map((s) => s.id)));
  const orphanStories = releaseStories
    .filter((s) => !validStepIds.has(s.stepId))
    .sort((a, b) => a.order - b.order);

  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: (theme) => theme.customShadows.z1,
      }}
    >
      {/* Release header bar — spans the full board width. */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'secondary.lighter',
          px: 2,
          py: 1.5,
        }}
      >
        <ThreeDotMenu
          onRename={() => titleRef.current?.beginEdit()}
          onDelete={() =>
            setConfirmDeleteTarget({
              type: 'release',
              id: release.id,
              label: `Delete release “${release.name}” and its stories?`,
            })
          }
        />
        <InlineEditInput
          ref={titleRef}
          value={release.name}
          onSave={(name) => updateRelease(release.id, { name })}
          ariaLabel="Release name"
          sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}
        />
        <Badge tone="accent" sx={{ ml: 'auto' }}>
          {`${storyCount} ${storyCount === 1 ? 'Story' : 'Stories'}`}
        </Badge>
      </Box>

      {/* Story grid — columns aligned to the step backbone above. */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: JOURNEY_GAP,
          bgcolor: 'grey.100',
          py: 2,
          px: BOARD_INSET,
        }}
      >
        {columns.map(({ journey, steps }) => (
          <Box key={journey.id} sx={{ display: 'flex', flexDirection: 'row', gap: STEP_GAP }}>
            {steps.map((step) => (
              <Box
                key={step.id}
                sx={{
                  width: COLUMN_WIDTH,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: STEP_GAP,
                  '&:hover .add-story-affordance': { opacity: 1, pointerEvents: 'auto' },
                }}
              >
                {storiesForStep(step.id).map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}

                <ButtonBase
                  className="add-story-affordance"
                  onClick={() => addStory(release.id, step.id, release.mapId)}
                  sx={{
                    width: '100%',
                    height: 38,
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'grey.300',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'text.disabled',
                    opacity: 0,
                    pointerEvents: 'none',
                    transition: 'opacity 0.15s, border-color 0.2s, background-color 0.2s, color 0.2s',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      bgcolor: 'secondary.lighter',
                      color: 'secondary.main',
                    },
                  }}
                >
                  + Add Story
                </ButtonBase>
              </Box>
            ))}
          </Box>
        ))}

        {/* Stories whose step no longer exists — shown at the same size. */}
        {orphanStories.length > 0 && (
          <Box sx={{ width: COLUMN_WIDTH, display: 'flex', flexDirection: 'column', gap: STEP_GAP }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700 }}>
              Unassigned
            </Typography>
            {orphanStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
```

### CHANGED: `src/components/board/ReleasesPanel.tsx`
```tsx
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { useBoardStore } from '../../store/boardStore';
import { ReleaseSection } from './ReleaseSection';

interface ReleasesPanelProps {
  mapId: string;
}

// Renders the pink dotted "Add Release" line followed by the stacked
// release bands for this map.
export function ReleasesPanel({ mapId }: ReleasesPanelProps) {
  const releases = useBoardStore((s) => s.releases);
  const journeys = useBoardStore((s) => s.journeys);
  const steps = useBoardStore((s) => s.steps);
  const addRelease = useBoardStore((s) => s.addRelease);

  const mapReleases = releases
    .filter((r) => r.mapId === mapId)
    .sort((a, b) => a.order - b.order);

  // The backbone columns (journeys → ordered steps) that every release aligns
  // its story columns to. Same order as the BoardCanvas backbone above.
  const columns = journeys
    .filter((j) => j.mapId === mapId)
    .sort((a, b) => a.order - b.order)
    .map((journey) => ({
      journey,
      steps: steps.filter((s) => s.journeyId === journey.id).sort((a, b) => a.order - b.order),
    }));

  return (
    <Box sx={{ mt: 5 }}>
      {/* Pink dotted line with the Add Release button at its start. */}
      <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <ButtonBase
          onClick={() => addRelease(mapId)}
          sx={{
            flexShrink: 0,
            borderRadius: 1.25,
            border: '1px solid',
            borderColor: 'secondary.main',
            bgcolor: 'secondary.lighter',
            color: 'secondary.main',
            px: 1.5,
            py: 0.75,
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            transition: 'background-color 0.2s, color 0.2s',
            '&:hover': { bgcolor: 'secondary.main', color: 'secondary.contrastText' },
          }}
        >
          + Add Release
        </ButtonBase>
        <Box sx={{ flex: 1, borderTop: '2px dashed', borderColor: 'secondary.main', opacity: 0.6 }} />
      </Box>

      {/* Stacked releases */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {mapReleases.map((release) => (
          <ReleaseSection key={release.id} release={release} columns={columns} />
        ))}
      </Box>
    </Box>
  );
}
```

### CHANGED: `src/components/shared/InlineEditInput.tsx`
```tsx
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import type { SxProps, Theme } from '@mui/material/styles';

export interface InlineEditHandle {
  beginEdit: () => void;
}

interface InlineEditInputProps {
  value: string;
  onSave: (next: string) => void;
  ariaLabel?: string;
  /** Styling for the text + input (applied to both for a seamless swap). */
  sx?: SxProps<Theme>;
}

// Reusable inline editor: text that becomes a focused input on click.
// Enter / blur saves (when non-empty); Escape reverts. Empty submit reverts.
// Parents can trigger edit mode imperatively via the ref's beginEdit().
export const InlineEditInput = forwardRef<InlineEditHandle, InlineEditInputProps>(
  function InlineEditInput({ value, onSave, ariaLabel, sx }, ref) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({ beginEdit: () => setEditing(true) }), []);

    // Keep the draft in sync when the value changes from elsewhere.
    useEffect(() => {
      if (!editing) setDraft(value);
    }, [value, editing]);

    // Focus + select all when entering edit mode.
    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }, [editing]);

    const commit = () => {
      const trimmed = draft.trim();
      if (trimmed && trimmed !== value) onSave(trimmed);
      else setDraft(value); // revert on empty or unchanged
      setEditing(false);
    };

    const cancel = () => {
      setDraft(value);
      setEditing(false);
    };

    if (editing) {
      return (
        <InputBase
          inputRef={inputRef}
          value={draft}
          fullWidth
          inputProps={{ 'aria-label': ariaLabel }}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              cancel();
            }
          }}
          sx={{
            font: 'inherit',
            color: 'inherit',
            px: 0.75,
            py: 0.25,
            borderRadius: 1,
            bgcolor: 'grey.100',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '&.Mui-focused': {
              borderColor: 'grey.400',
              boxShadow: (theme) => `0 0 0 3px ${theme.palette.action.hover}`,
            },
            ...sx,
          }}
        />
      );
    }

    return (
      <Box
        component="span"
        role="button"
        tabIndex={0}
        title="Click to edit"
        onClick={() => setEditing(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setEditing(true);
        }}
        sx={{ cursor: 'text', ...sx }}
      >
        {value}
      </Box>
    );
  }
);
```

### CHANGED (rewritten): `src/components/drawer/StoryDrawer.tsx`
```tsx
import { useEffect, useState, type ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import LinkIcon from '@mui/icons-material/Link';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import { useBoardStore } from '../../store/boardStore';
import { Button } from '../shared/Button';
import { InlineEditInput } from '../shared/InlineEditInput';
import { AttachmentUploader } from './AttachmentUploader';

// Decorative toolbar group (visual only — matches the Figma editor chrome).
function ToolGroup({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
      {children}
    </Box>
  );
}

const toolIconSx = { fontSize: 18 } as const;

// Centered "Story Details" modal — recreated from the Figma design
// (file sKsAuLWUzZPECcbFCKChUm, node 3904:3814). Title saves instantly;
// description is buffered and committed on "Save Changes". Attachments save
// immediately. The description toolbar is visual-only (plain-text editing).
export function StoryDrawer() {
  const activeStoryId = useBoardStore((s) => s.activeStoryId);
  const closeStoryDrawer = useBoardStore((s) => s.closeStoryDrawer);
  const story = useBoardStore((s) => s.stories.find((st) => st.id === s.activeStoryId));
  const updateStory = useBoardStore((s) => s.updateStory);

  const [description, setDescription] = useState('');

  // Load buffer when the open story changes.
  useEffect(() => {
    if (story) setDescription(story.description);
  }, [story?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isDirty = !!story && description !== story.description;

  const requestClose = () => {
    if (isDirty && !window.confirm('Discard unsaved changes to the description?')) return;
    closeStoryDrawer();
  };

  const handleSave = () => {
    if (!story) return;
    updateStory(story.id, { description });
    closeStoryDrawer();
  };

  return (
    <Dialog
      open={!!activeStoryId && !!story}
      onClose={requestClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: 1011,
            maxWidth: '95vw',
            maxHeight: '95vh',
            m: 2,
            p: 3,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            boxShadow:
              '0px 0px 1px rgba(145,158,171,0.2), 0px 12px 12px rgba(145,158,171,0.12)',
          },
        },
      }}
    >
      {story && (
        <>
          {/* Scrollable content */}
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto', minHeight: 0 }}
          >
            {/* Header: title + close-square */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Typography
                sx={{ fontSize: 24, fontWeight: 700, lineHeight: '36px', color: 'text.primary' }}
              >
                Story Details
              </Typography>
              <IconButton
                aria-label="Close"
                onClick={requestClose}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  color: 'text.secondary',
                  bgcolor: 'rgba(145,158,171,0.16)',
                  '&:hover': { bgcolor: 'rgba(145,158,171,0.28)' },
                }}
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            {/* Story title (editable, styled as the Figma "Title Here") */}
            <InlineEditInput
              value={story.title}
              onSave={(title) => updateStory(story.id, { title })}
              ariaLabel="Story title"
              sx={{ display: 'block', fontSize: 24, fontWeight: 700, lineHeight: '36px', color: 'text.primary' }}
            />

            {/* Description editor */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                sx={{ fontSize: 14, fontWeight: 600, lineHeight: '22px', color: 'text.secondary' }}
              >
                Description
              </Typography>
              <Box
                sx={{
                  height: 419,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '8px',
                  border: '1px solid rgba(145,158,171,0.32)',
                  overflow: 'hidden',
                }}
              >
                {/* Toolbar (visual only) */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    px: 2,
                    py: 1.25,
                    borderBottom: '1px solid rgba(145,158,171,0.24)',
                    flexWrap: 'wrap',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.primary' }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Font</Typography>
                    <ArrowDropDownIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <ToolGroup>
                    <FormatBoldIcon sx={toolIconSx} />
                    <FormatItalicIcon sx={toolIconSx} />
                    <FormatUnderlinedIcon sx={toolIconSx} />
                    <StrikethroughSIcon sx={toolIconSx} />
                  </ToolGroup>
                  <ToolGroup>
                    <FormatListNumberedIcon sx={toolIconSx} />
                    <FormatListBulletedIcon sx={toolIconSx} />
                  </ToolGroup>
                  <ToolGroup>
                    <FormatIndentIncreaseIcon sx={toolIconSx} />
                    <FormatAlignLeftIcon sx={toolIconSx} />
                  </ToolGroup>
                  <ToolGroup>
                    <LinkIcon sx={toolIconSx} />
                    <ImageOutlinedIcon sx={toolIconSx} />
                    <TableChartOutlinedIcon sx={toolIconSx} />
                  </ToolGroup>
                  <ToolGroup>
                    <FormatClearIcon sx={toolIconSx} />
                  </ToolGroup>
                </Box>

                {/* Content (plain-text editing) */}
                <InputBase
                  multiline
                  fullWidth
                  placeholder="Write something awesome..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{
                    flex: 1,
                    alignItems: 'flex-start',
                    overflowY: 'auto',
                    px: 2,
                    py: 1.5,
                    fontSize: 16,
                    lineHeight: '24px',
                    color: 'text.primary',
                    '& .MuiInputBase-input': { height: '100% !important' },
                    '& .MuiInputBase-input::placeholder': { color: '#919EAB', opacity: 1 },
                  }}
                />
              </Box>
            </Box>

            {/* Images */}
            <AttachmentUploader story={story} />
          </Box>

          {/* Save Changes (bottom-right) */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleSave}>Save Changes</Button>
          </Box>
        </>
      )}
    </Dialog>
  );
}
```

### CHANGED (reskinned): `src/components/drawer/AttachmentUploader.tsx`
```tsx
import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloseIcon from '@mui/icons-material/Close';
import type { Story } from '../../types';
import { useBoardStore } from '../../store/boardStore';
import { generateId } from '../../lib/idgen';
import { ATTACHMENT_WARN_BYTES, formatBytes, isStorageNearlyFull } from '../../lib/storage';

interface AttachmentUploaderProps {
  story: Story;
}

// "Images" section — matches the Figma upload dropzone. Local-only: reads the
// selected file as a base64 data URL (no backend) and stores it on the story.
// Warns (does not block) on large files or when localStorage is getting full.
export function AttachmentUploader({ story }: AttachmentUploaderProps) {
  const addAttachment = useBoardStore((s) => s.addAttachment);
  const deleteAttachment = useBoardStore((s) => s.deleteAttachment);
  const inputRef = useRef<HTMLInputElement>(null);
  const [warning, setWarning] = useState('');

  const handleFile = (file: File) => {
    const messages: string[] = [];
    if (file.size > ATTACHMENT_WARN_BYTES) {
      messages.push(`“${file.name}” is ${formatBytes(file.size)} — large files fill up storage fast.`);
    }

    const reader = new FileReader();
    reader.onload = () => {
      addAttachment(story.id, {
        id: generateId(),
        name: file.name,
        type: file.type,
        dataUrl: String(reader.result),
        uploadedAt: new Date().toISOString(),
      });
      if (isStorageNearlyFull()) {
        messages.push('Storage is nearly full. Consider removing large attachments.');
      }
      setWarning(messages.join(' '));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        sx={{ mb: 1, fontSize: 14, fontWeight: 600, lineHeight: '22px', color: 'text.secondary' }}
      >
        Images
      </Typography>

      {/* Dashed upload dropzone (Figma "Upload file"). */}
      <ButtonBase
        onClick={() => inputRef.current?.click()}
        sx={{
          width: '100%',
          flexDirection: 'column',
          gap: 0.5,
          borderRadius: '12px',
          border: '1px dashed rgba(145, 158, 171, 0.48)',
          bgcolor: 'rgba(145, 158, 171, 0.08)',
          p: 2.5,
          color: 'text.disabled',
          transition: 'border-color 0.2s, background-color 0.2s, color 0.2s',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter', color: 'primary.main' },
        }}
      >
        <CloudUploadOutlinedIcon sx={{ fontSize: 40 }} />
        <Typography sx={{ fontSize: 14, lineHeight: '22px' }}>Upload file</Typography>
      </ButtonBase>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf,.doc,.docx,.txt"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      {warning && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'warning.main' }}>
          {warning}
        </Typography>
      )}

      {/* Preview thumbnails */}
      {story.attachments.length > 0 && (
        <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {story.attachments.map((att) => (
            <Box key={att.id} sx={{ position: 'relative' }}>
              {att.type.startsWith('image/') ? (
                <Box
                  component="img"
                  src={att.dataUrl}
                  alt={att.name}
                  sx={{ width: 64, height: 64, borderRadius: 2, border: '1px solid', borderColor: 'divider', objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    fontSize: 12,
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
                >
                  {att.name.split('.').pop()}
                </Box>
              )}
              <IconButton
                aria-label={`Remove ${att.name}`}
                onClick={() => deleteAttachment(story.id, att.id)}
                sx={{
                  position: 'absolute',
                  right: -8,
                  top: -8,
                  width: 20,
                  height: 20,
                  bgcolor: 'text.primary',
                  color: 'common.white',
                  '&:hover': { bgcolor: 'common.black' },
                }}
              >
                <CloseIcon sx={{ fontSize: 13 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
```

### CHANGED: `src/pages/StoryMapBoardPage.tsx`
```tsx
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useProjectStore } from '../store/projectStore';
import { useBoardStore } from '../store/boardStore';
import { Header } from '../components/layout/Header';
import { InlineEditInput } from '../components/shared/InlineEditInput';
import { BoardCanvas } from '../components/board/BoardCanvas';
import { ReleasesPanel } from '../components/board/ReleasesPanel';
import { StoryDrawer } from '../components/drawer/StoryDrawer';
import { EmptyState } from '../components/shared/EmptyState';
import { Button } from '../components/shared/Button';

export function StoryMapBoardPage() {
  const { mapId } = useParams<{ mapId: string }>();
  const navigate = useNavigate();
  const storyMap = useProjectStore((s) => s.storyMaps.find((m) => m.id === mapId));
  const updateStoryMap = useProjectStore((s) => s.updateStoryMap);
  const addJourney = useBoardStore((s) => s.addJourney);

  if (!storyMap) {
    return (
      <>
        <Header
          title="Story Map"
          actions={
            <Button variant="ghost" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
              Back
            </Button>
          }
        />
        <Box sx={{ flex: 1, overflow: 'auto', p: 4 }}>
          <EmptyState
            icon="❓"
            title="Story map not found"
            description="This map may have been deleted."
            action={<Button onClick={() => navigate('/')}>Back to dashboard</Button>}
          />
        </Box>
      </>
    );
  }

  return (
    <>
      <Header
        leading={
          <Button variant="ghost" startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
            Back
          </Button>
        }
        title={
          <InlineEditInput
            value={storyMap.name}
            onSave={(name) => updateStoryMap(storyMap.id, { name })}
            ariaLabel="Story map name"
            sx={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', color: 'text.primary' }}
          />
        }
        actions={<Button onClick={() => addJourney(storyMap.id)}>+ Add Journey</Button>}
      />
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'grey.100', p: 3 }}>
        <Box
          sx={{
            // Grow to the full board width so the backbone + release bands share
            // one horizontal scroll and their columns stay aligned.
            width: 'max-content',
            minWidth: '100%',
            minHeight: '100%',
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            p: 3,
            boxShadow: (theme) => theme.customShadows.card,
          }}
        >
          <BoardCanvas mapId={storyMap.id} />
          <ReleasesPanel mapId={storyMap.id} />
        </Box>
      </Box>
      <StoryDrawer />
    </>
  );
}
```

### CHANGED (only `signIn()` added vs. original): `src/pages/LoginPage.tsx`
```tsx
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Logo } from '../components/shared/Logo';
import { signIn } from '../lib/auth';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

// Standalone sign-in page recreating the Minimals (Amplify) sign-in form.
// Client-side only — submitting navigates to the dashboard. No backend/auth.
export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    signIn();
    navigate('/');
  };

  // Light, glass-readable styling for the inputs (white text + light borders).
  const fieldSx = {
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.6)' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
    },
    '& .MuiOutlinedInput-input::placeholder': { color: 'rgba(255, 255, 255, 0.5)', opacity: 1 },
    '& .MuiInputAdornment-root .MuiIconButton-root': { color: 'rgba(255, 255, 255, 0.7)' },
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#011022',
        p: 2,
      }}
    >
      {/* Background video */}
      <Box
        component="video"
        src="/waves.mp4"
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          // Keep the video on its own GPU layer so it never throttles when idle.
          transform: 'translateZ(0)',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />

      <Card
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 448,
          p: { xs: 3, sm: 5 },
          // Liquid glass — clearer, less frosted, bright rim + specular highlight
          bgcolor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px) saturate(180%) brightness(1.08)',
          WebkitBackdropFilter: 'blur(10px) saturate(180%) brightness(1.08)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          boxShadow:
            'inset 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -1px 1px rgba(255, 255, 255, 0.15), 0 12px 40px rgba(0, 0, 0, 0.45)',
          transform: 'translateZ(0)',
          // Continuously nudge the blur by an imperceptible amount so the
          // browser never idles (and freezes) the backdrop over the video.
          animation: 'glassKeepAlive 4s ease-in-out infinite alternate',
          '@keyframes glassKeepAlive': {
            from: {
              backdropFilter: 'blur(10px) saturate(180%) brightness(1.08)',
              WebkitBackdropFilter: 'blur(10px) saturate(180%) brightness(1.08)',
            },
            to: {
              backdropFilter: 'blur(10.5px) saturate(180%) brightness(1.08)',
              WebkitBackdropFilter: 'blur(10.5px) saturate(180%) brightness(1.08)',
            },
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 5 }}>
          <Logo variant="white" height={30} />
        </Box>

        {/* Heading */}
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
            Sign in to your account
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.72)' }}>
              Don't have an account?
            </Typography>
            <Link
              component="button"
              type="button"
              variant="subtitle2"
              underline="hover"
              sx={{ color: '#FFB6C1', '&:hover': { color: '#FF9DB2' } }}
            >
              Get started
            </Link>
          </Stack>
        </Stack>

        {/* Form */}
        <Stack component="form" spacing={3} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email address"
            type="email"
            autoComplete="email"
            sx={fieldSx}
          />

          <Stack spacing={1.5}>
            <TextField
              fullWidth
              label="Password"
              placeholder="6+ characters"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              sx={fieldSx}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Link
              component="button"
              type="button"
              variant="body2"
              underline="none"
              sx={{ alignSelf: 'flex-end', color: 'rgba(255, 255, 255, 0.72)' }}
            >
              Forgot password?
            </Link>
          </Stack>

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            sx={{
              minHeight: 48,
              bgcolor: '#fff',
              color: 'text.primary',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.86)' },
            }}
          >
            Sign in
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
```

### DELETED this session (remove these files in the new workspace)
- `src/components/drawer/CommentSection.tsx`
- `src/hooks/useEscapeKey.ts`
- `src/hooks/useClickOutside.ts`

## S2.7 Open Items & Next Steps

- **No pending/in-progress task.** All requested work is done and verified.
- **Offered but NOT yet approved:** wrap `StoryCard` and `StepCard` in **`React.memo`** to cut re-renders on large boards (the biggest remaining perf lever; user framed the perf pass as "remove code," so this was left as a suggestion). Safe because card `story`/`step` props keep stable references for unchanged items.
- **Known limitation:** no drag-and-drop, so a story under the **"Unassigned"** column (its step was deleted) can't be re-homed except by delete + re-add. Offered to add a **"Move to step…"** option in the story three-dot menu — not yet requested.
- **Login background:** earlier asked to replace video with an image, then rolled back. `public/login-bg.png` (if present) is unused. `public/waves.mp4` (8MB) is still used; user opted to keep it.
- **Standard workflow to continue:** make change → `npm run build` (must pass) → ensure dev server running (`npm run dev`, or restart the Claude Preview `storymap` server) → tell the user the URL + what changed, briefly.

## S2.8 Key Terms & Shorthand (additions)

- **Backbone** — the top row of the board: journeys + their horizontal steps; scrolls horizontally; defines the column grid.
- **Column grid / column-aligned** — stories in a release band line up vertically under the step they belong to (via `Story.stepId`).
- **`boardLayout.ts` constants** — `COLUMN_WIDTH=200`, `CARD_HEIGHT=100`, `STEP_GAP=1` (8px), `JOURNEY_GAP=3` (24px), `BOARD_INSET=2` (16px). Shared by backbone + release grid for alignment.
- **Unassigned column** — trailing column in a release for stories whose `stepId` no longer matches a step (orphans), shown at 200×100.
- **Hover affordance** — the green "+" that appears only on hover: on the **last** step (add step) and on each step column in a release (add story, class `add-story-affordance`).
- **`leading` slot** — `Header` prop that renders an element (the Back button) to the left of the title.
- **`AppLayout` vs `BoardLayout`** — `AppLayout` = sidebar shell (dashboard); `BoardLayout` = full-screen board shell (no sidebar) that still mounts `ConfirmDeleteModal`.
- **`RequireAuth`** — route wrapper in `App.tsx` gating the app behind the in-memory sign-in flag (`src/lib/auth.ts`).
- **Story Details modal** — the centered Figma modal replacing the old right-side drawer (component is still named `StoryDrawer`). Figma file `sKsAuLWUzZPECcbFCKChUm`, node `3904:3814`.
- **Claude Preview `storymap`** — the dev-server config in `.claude/launch.json` (port 5173); used for in-browser verification.
- **`storymap-board` version 2** — the board store's persisted schema version; the v1→v2 migration backfills `stepId`.

*Continuation handoff (Session 2) — complete and ready for implementation.*
