import { PageHeader } from '../components/layout/PageHeader'
import { FoundationPanel } from '../components/ui/FoundationPanel'

export function EvaluationsPage() {
  return (
    <>
      <PageHeader
        title="Evaluations"
        description="Track quality, accuracy, and reliability for your AI agents."
      />

      <FoundationPanel title="Evaluations foundation">
        Start with score cards, evaluation charts, dimension summaries, and a recent evaluations
        table.
      </FoundationPanel>
    </>
  )
}
