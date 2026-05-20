import { PageHeader } from '../components/layout/PageHeader'
import { FoundationPanel } from '../components/ui/FoundationPanel'

export function TraceDetailsPage() {
  return (
    <>
      <PageHeader
        title="Trace Details"
        description="Inspect execution timelines, spans, prompts, tool calls, and metadata."
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <FoundationPanel title="Timeline area">
          This should become the main wow-factor surface: execution timeline above span rows.
        </FoundationPanel>
        <FoundationPanel title="Span details panel">
          Keep this as a right-side inspector on desktop and stack it below on smaller screens.
        </FoundationPanel>
      </div>
    </>
  )
}
