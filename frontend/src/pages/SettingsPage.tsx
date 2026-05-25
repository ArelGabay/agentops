import {
  BookOpen,
  Building2,
  ChevronRight,
  Moon,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import type { ReactNode } from "react";

import { PageHeader } from "../components/layout/PageHeader";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Tabs } from "../components/ui/Tabs";
import { useSettingsSummary } from "../hooks";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-200">
        {label}
      </span>
      {children}
    </label>
  );
}

function StaticInput({ value }: { value: string }) {
  return (
    <div className="flex h-11 items-center rounded-lg border border-app-border bg-white/[0.02] px-3 text-sm text-slate-100">
      {value}
    </div>
  );
}

function IntegrationRow({
  name,
  status,
  description,
}: {
  name: string;
  status: "available" | "unavailable" | "optional";
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-app-border py-3 last:border-0">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-xs font-semibold text-slate-200">
          {name.slice(0, 2)}
        </span>
        <div className="min-w-0">
          <span className="block truncate text-sm font-medium text-slate-100">
            {name}
          </span>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge
          status={capabilityStatusToBadgeStatus(status)}
          label={formatCapabilityStatus(status)}
        />
      </div>
    </div>
  );
}

function capabilityStatusToBadgeStatus(
  status: "available" | "unavailable" | "optional",
) {
  if (status === "available") {
    return "success" as const;
  }

  if (status === "optional") {
    return "in-progress" as const;
  }

  return "canceled" as const;
}

function formatCapabilityStatus(status: string) {
  if (status === "available") {
    return "Available";
  }

  if (status === "optional") {
    return "Optional";
  }

  return "Unavailable";
}

export function SettingsPage() {
  const settingsQuery = useSettingsSummary();

  const settings = settingsQuery.data;
  const isLoading = settingsQuery.isLoading;
  const isError = settingsQuery.isError;

  const getUnavailableReason = (name: string, fallback: string) =>
    settings?.unavailable_features.find((feature) => feature.name === name)
      ?.reason ?? fallback;

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Settings"
          description="Manage your workspace, integrations, and platform preferences."
        />

        <div className="flex flex-wrap gap-3">
          <Button disabled variant="secondary">
            <BookOpen className="h-4 w-4" />
            Documentation
          </Button>
          <div className="flex h-10 items-center rounded-lg border border-app-border bg-white/[0.03] px-4 text-sm text-slate-300">
            <Moon className="mr-2 h-4 w-4 text-violet-300" />
            Dark mode active
          </div>
        </div>
      </div>

      {isLoading && (
        <Card className="mt-4 border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-200">
          Loading settings...
        </Card>
      )}

      {isError && (
        <Card className="mt-4 border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          Settings are unavailable.
        </Card>
      )}

      <Tabs
        items={[
          { label: "General", active: true },
          { label: "Evaluations" },
          { label: "Alerts" },
          { label: "Integrations" },
          { label: "API Keys" },
          { label: "Team" },
          { label: "Billing" },
        ]}
      />

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_0.85fr_0.85fr]">
        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Workspace Settings
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Update your workspace details and preferences.
                </p>
              </div>
              <Button disabled variant="primary">
                Settings Read-only
              </Button>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_180px]">
              <div className="space-y-4">
                <Field label="Workspace Name">
                  <StaticInput value={settings?.app.name ?? "N/A"} />
                </Field>
                <Field label="Environment">
                  <StaticInput value={settings?.app.environment ?? "N/A"} />
                </Field>
                <Field label="Timezone">
                  <StaticInput value="Not configured" />
                </Field>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-app-border bg-white/[0.02] p-4 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
                  <Building2 className="h-10 w-10" />
                </div>
                <Button disabled variant="secondary">
                  <Upload className="h-4 w-4" />
                  Upload Logo
                </Button>
                <p className="text-xs text-slate-500">
                  Logo upload is not available yet.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-white">Appearance</h2>
            <p className="mt-1 text-sm text-slate-400">
              Customize the look and feel of AgentOps.
            </p>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-medium text-slate-200">Theme</p>
                <div className="rounded-lg border border-app-border bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-100">
                      <Moon className="h-4 w-4 text-violet-300" />
                      Dark mode
                    </span>
                    <StatusBadge status="success" label="Active" />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Light and system themes are not implemented yet.
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-slate-200">
                  Accent Color
                </p>
                <div className="rounded-lg border border-app-border bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-100">
                      <span className="h-4 w-4 rounded-full bg-violet-500" />
                      Violet
                    </span>
                    <StatusBadge status="success" label="Active" />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Accent color customization is not persisted yet.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-white">Notifications</h2>
            <p className="mt-1 text-sm text-slate-400">
              Configure how and when you want to be notified.
            </p>

            <div className="mt-6 rounded-lg border border-app-border bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
              {getUnavailableReason(
                "Notification delivery",
                "Notification delivery is not available yet.",
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-white">
              Evaluation Settings
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Configure how evaluations are run and scored.
            </p>

            <div className="mt-5 rounded-lg border border-app-border bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
              {getUnavailableReason(
                "Evaluation configuration",
                "Evaluation configuration is not available yet. Evaluations can be ingested and viewed, but model, frequency, and threshold settings are not persisted.",
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-white">
              Evaluation Dimensions
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Select the dimensions to include in evaluations.
            </p>

            <div className="mt-5 rounded-lg border border-app-border bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
              {getUnavailableReason(
                "Evaluation dimensions",
                "Evaluation dimensions are not configurable yet.",
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-white">Integrations</h2>
            <p className="mt-1 text-sm text-slate-400">
              Manage your connected services.
            </p>

            <div className="mt-4">
              {settings?.capabilities.map((capability) => (
                <IntegrationRow
                  key={capability.name}
                  name={capability.name}
                  status={capability.status}
                  description={capability.description}
                />
              ))}
              {!settings && !isLoading && (
                <p className="py-4 text-sm text-slate-400">
                  No configuration data available.
                </p>
              )}
            </div>

            <Button className="mt-4 w-full" disabled variant="secondary">
              Browse all integrations
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-white">API Keys</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Manage API keys for accessing AgentOps API.
                </p>
              </div>
              <Button
                className="h-auto min-h-10 max-w-[124px] flex-wrap px-3 py-2 text-center leading-tight"
                disabled
                variant="primary"
              >
                <Plus className="h-4 w-4" />
                Create API Key
              </Button>
            </div>

            <div className="rounded-lg border border-app-border bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
              {getUnavailableReason(
                "API key management",
                "API key management is not available until authentication and API key storage exist.",
              )}
            </div>

            <Button className="mt-4 w-full" disabled variant="secondary">
              View all API keys
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-white">Danger Zone</h2>
            <p className="mt-1 text-sm text-slate-400">
              Irreversible and destructive actions.
            </p>

            <Button className="mt-5 w-full" disabled variant="danger">
              <Trash2 className="h-4 w-4" />
              Delete Workspace
            </Button>
            <p className="mt-3 text-center text-xs text-slate-500">
              This action cannot be undone.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
