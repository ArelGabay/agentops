import { PageHeader } from '../components/layout/PageHeader'
import { FoundationPanel } from '../components/ui/FoundationPanel'

export function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your workspace, integrations, and platform preferences."
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <FoundationPanel title="Workspace settings">
          Use tabs for settings sections and compact cards for related controls.
        </FoundationPanel>
        <FoundationPanel title="Integrations and API keys">
          Keep connected services and API key management in narrow right-side panels.
        </FoundationPanel>
      </div>
    </>
  )
}
