# AgentOps Frontend

React + TypeScript frontend for AgentOps, the AI agent observability dashboard.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- React Router
- React Query
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
- Route-level pages for Dashboard, Traces, Trace Details, Evaluations, and Settings
- Tailwind dark-mode-first styling foundation
- Typed API response models for traces, spans, and evaluations
- Frontend API service functions for backend read endpoints
- React Query provider and reusable data hooks for dashboard summary, traces, trace details, and evaluations
- Dashboard metrics, charts, status counts, top agents, and recent traces wired to backend aggregation data
- Traces, Trace Details, and Evaluations pages wired to backend API data with honest loading, error, and empty states

## API Services

The frontend API layer lives in `src/services/` and uses native `fetch`.

Available service functions:

- `getDashboardSummary()`
- `getTraces(limit)`
- `getTraceDetail(traceId)`
- `getEvaluations(limit)`

The API base URL defaults to:

```txt
http://127.0.0.1:8000
```

It can be overridden with:

```txt
VITE_API_BASE_URL
```

## Data Hooks

React Query is configured in `src/app/providers.tsx`.

Reusable data hooks live in `src/hooks/`:

- `useDashboardSummary()`
- `useTraces(limit)`
- `useTraceDetail(traceId)`
- `useEvaluations(limit)`

Pages should use these hooks when they are wired to real backend data. Fetch logic should stay in `src/services/`.
