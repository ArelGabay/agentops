# AgentOps Frontend

React + TypeScript frontend for AgentOps, the AI agent observability dashboard.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- React Router
- lucide-react

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Architecture

```txt
src/
  app/          routing and app providers
  layouts/      shared page shells
  pages/        route-level views
  components/   reusable UI and layout components
  hooks/        reusable frontend logic
  services/     API communication
  store/        future client state helpers
  types/        shared TypeScript types
  utils/        formatting and frontend helpers
  styles/       shared style assets
```

Pages should compose components. Components should stay presentation-focused. API calls should live in `services/`, with reusable data hooks in `hooks/` when needed.

## Current Foundation

- Shared `MainLayout`
- Sidebar navigation
- Route placeholders for Dashboard, Traces, Trace Details, Evaluations, and Settings
- Tailwind dark-mode-first styling foundation
