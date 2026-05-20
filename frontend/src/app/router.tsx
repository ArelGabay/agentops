import { Navigate, createBrowserRouter } from 'react-router-dom'

import { MainLayout } from '../layouts/MainLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { EvaluationsPage } from '../pages/EvaluationsPage'
import { SettingsPage } from '../pages/SettingsPage'
import { TraceDetailsPage } from '../pages/TraceDetailsPage'
import { TracesPage } from '../pages/TracesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'traces', element: <TracesPage /> },
      { path: 'traces/:traceId', element: <TraceDetailsPage /> },
      { path: 'evaluations', element: <EvaluationsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
