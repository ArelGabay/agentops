import { PageHeader } from '../components/layout/PageHeader'
import { FoundationPanel } from '../components/ui/FoundationPanel'

export function TracesPage() {
  return (
    <>
      <PageHeader title="Traces" description="Search, filter, and analyze your agent traces." />

      <FoundationPanel title="Traces foundation">
        Build this page around a filter toolbar, a reusable data table, status badges, and
        pagination.
      </FoundationPanel>
    </>
  )
}
