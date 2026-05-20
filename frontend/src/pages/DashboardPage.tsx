import { PageHeader } from '../components/layout/PageHeader'
import { FoundationPanel } from '../components/ui/FoundationPanel'

export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your AI agents and system performance."
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <FoundationPanel title="Next component">
          Start here with reusable metric cards inspired by the dashboard mockup.
        </FoundationPanel>
        <FoundationPanel title="Layout direction">
          Use a responsive KPI grid first, then add chart cards below it.
        </FoundationPanel>
        <FoundationPanel title="Data strategy">
          Use local mock data until the backend trace APIs are ready.
        </FoundationPanel>
      </div>
    </>
  )
}
