import {
  Activity,
  Bell,
  Bot,
  Boxes,
  ChartNoAxesCombined,
  LayoutDashboard,
  Settings,
  Wrench,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Traces', href: '/traces', icon: Activity },
  { label: 'Evaluations', href: '/evaluations', icon: ChartNoAxesCombined },
  { label: 'Agents', href: '/agents', icon: Bot },
  { label: 'Tools', href: '/tools', icon: Wrench },
  { label: 'Alerts', href: '/alerts', icon: Bell },
  { label: 'Integrations', href: '/integrations', icon: Boxes },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="hidden fixed inset-y-0 left-0 z-40 w-64 border-r border-app-border bg-slate-950/95 px-4 py-6 lg:flex lg:flex-col">
      <div className="mb-10 flex items-center gap-3 px-1">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-violet-600 font-semibold text-white">
          A
        </div>
        <span className="text-xl font-semibold tracking-tight">AgentOps</span>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition',
                isActive
                  ? 'bg-violet-600/25 text-white ring-1 ring-violet-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white',
              ].join(' ')
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div>
          <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            Project
          </p>
          <button className="w-full rounded-lg border border-app-border bg-white/[0.03] px-3 py-3 text-left">
            <span className="block text-sm font-medium text-slate-100">Default Project</span>
            <span className="block text-xs text-slate-500">Production</span>
          </button>
        </div>

        <div className="rounded-lg border border-app-border bg-white/[0.03] p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-violet-600 text-sm font-semibold">
              NK
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-100">Noman Korai</p>
              <p className="truncate text-xs text-slate-500">noman@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
