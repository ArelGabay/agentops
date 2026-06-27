import {
  BookOpen,
  Building2,
  ChevronRight,
  Moon,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { PageHeader } from "../components/layout/PageHeader";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { StatusBadge } from "../components/ui/StatusBadge";
import { EmptyState } from "../components/ui/EmptyState";
import { NoticeCard } from "../components/ui/NoticeCard";
import { useSettingsSummary, useUpdateSettingsPreferences } from "../hooks";
import type { SettingsPreferencesUpdate } from "../types";

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

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className="h-11 w-full rounded-lg border border-app-border bg-white/[0.02] px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-slate-500"
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type="text"
      value={value}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <select
      className="h-11 w-full rounded-lg border border-app-border bg-white/[0.02] px-3 text-sm text-slate-100 outline-none transition focus:border-slate-500"
      onChange={(event) => onChange(event.target.value)}
      value={value}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
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

  const updateSettingsMutation = useUpdateSettingsPreferences();

  const [workspaceName, setWorkspaceName] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [themePreference, setThemePreference] =
    useState<SettingsPreferencesUpdate["theme_preference"]>("dark");
  const [accentColor, setAccentColor] =
    useState<SettingsPreferencesUpdate["accent_color"]>("violet");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const settings = settingsQuery.data;
  const isLoading = settingsQuery.isLoading;
  const isError = settingsQuery.isError;

  useEffect(() => {
    if (!settings) {
      return;
    }

    setWorkspaceName(settings.preferences.workspace_name);
    setTimezone(settings.preferences.timezone);
    setThemePreference(settings.preferences.theme_preference);
    setAccentColor(settings.preferences.accent_color);
  }, [settings]);

  const preferences = settings?.preferences;
  const hasSettings = Boolean(preferences);

  const formValues: SettingsPreferencesUpdate = {
    workspace_name: workspaceName,
    timezone,
    theme_preference: themePreference,
    accent_color: accentColor,
  };

  const isDirty =
    preferences !== undefined &&
    (workspaceName !== preferences.workspace_name ||
      timezone !== preferences.timezone ||
      themePreference !== preferences.theme_preference ||
      accentColor !== preferences.accent_color);

  async function handleSave() {
    setSaveMessage(null);

    try {
      await updateSettingsMutation.mutateAsync(formValues);
      setSaveMessage("Settings saved.");
      void settingsQuery.refetch();
    } catch {
      setSaveMessage("Unable to save settings.");
    }
  }

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
        <NoticeCard className="mt-4">Loading settings...</NoticeCard>
      )}

      {isError && (
        <NoticeCard className="mt-4" tone="error">
          Settings are unavailable.
        </NoticeCard>
      )}

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
              <Button
                disabled={
                  !hasSettings || !isDirty || updateSettingsMutation.isPending
                }
                onClick={() => {
                  void handleSave();
                }}
                variant="primary"
              >
                Save Changes
              </Button>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_180px]">
              <div className="space-y-4">
                <Field label="Workspace Name">
                  <TextInput
                    onChange={setWorkspaceName}
                    value={workspaceName}
                  />
                </Field>
                <Field label="Environment">
                  <StaticInput value={settings?.app.environment ?? "N/A"} />
                </Field>
                <Field label="Timezone">
                  <TextInput
                    onChange={setTimezone}
                    placeholder="UTC"
                    value={timezone}
                  />
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

            {saveMessage && (
              <NoticeCard
                className="mt-5"
                tone={saveMessage.includes("Unable") ? "error" : "info"}
              >
                {saveMessage}
              </NoticeCard>
            )}
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
                  <SelectInput
                    onChange={(value) =>
                      setThemePreference(
                        value as SettingsPreferencesUpdate["theme_preference"],
                      )
                    }
                    options={[{ label: "Dark", value: "dark" }]}
                    value={themePreference}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Dark mode is the only supported theme in this milestone.
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-slate-200">
                  Accent Color
                </p>
                <div className="rounded-lg border border-app-border bg-white/[0.03] p-4">
                  <SelectInput
                    onChange={(value) =>
                      setAccentColor(
                        value as SettingsPreferencesUpdate["accent_color"],
                      )
                    }
                    options={[
                      { label: "Violet", value: "violet" },
                      { label: "Blue", value: "blue" },
                      { label: "Emerald", value: "emerald" },
                      { label: "Amber", value: "amber" },
                    ]}
                    value={accentColor}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Accent color is persisted now and reserved for broader UI
                    use later.
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

            <EmptyState
              className="mt-6"
              title={getUnavailableReason(
                "Notification delivery",
                "Notification delivery is not available yet.",
              )}
            />
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

            <EmptyState
              className="mt-5"
              description={getUnavailableReason(
                "Evaluation configuration",
                "Evaluations can be ingested and viewed, but model, frequency, and threshold settings are not persisted.",
              )}
              title="Configuration unavailable"
            />
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-white">
              Evaluation Dimensions
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Select the dimensions to include in evaluations.
            </p>

            <EmptyState
              className="mt-5"
              description={getUnavailableReason(
                "Evaluation dimensions",
                "Dimension-level settings are not configurable yet.",
              )}
              title="Dimensions unavailable"
            />
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
                <EmptyState title="No configuration data available." />
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

            <EmptyState
              title={getUnavailableReason(
                "API key management",
                "API key management is not available until authentication and API key storage exist.",
              )}
            />

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
