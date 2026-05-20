import { Outlet } from 'react-router-dom'

import { Sidebar } from '../components/layout/Sidebar'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-app-background text-slate-100">
      <Sidebar />

      <main className="min-h-screen lg:pl-64">
        <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
