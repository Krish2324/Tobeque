# Refactor plan: clean React+Vite folder structure

- [ ] Create new folder structure under `src/` (app, pages, components, features, styles, lib)
- [ ] Implement extracted theme logic (`src/features/theme/useTheme.ts`)
- [ ] Implement extracted console logic (`src/features/console/*`)
- [ ] Create UI components (Navbar, ConsoleTerminal, StatsRow, ShowcaseGrid)
- [ ] Create DashboardPage composing the components
- [ ] Replace `src/App.tsx` with a thin composition root that renders `DashboardPage`
- [x] Move/rename CSS: `src/index.css` -> `src/styles/index.css`, `src/App.css` -> `src/styles/app.css`

- [ ] Update imports in `src/main.tsx` and all components
- [ ] Remove/cleanup old files if no longer used (original `src/App.tsx`, `src/index.css`, `src/App.css` after moving)
- [ ] Run `npm run lint` and `npm run build` to verify
