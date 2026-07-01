import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import { SettingsPage } from "./SettingsPage";
import { renderWithProviders } from "../tests/render";

const mockUseSettingsSummary = vi.fn();
const mockMutateAsync = vi.fn();

vi.mock("../hooks", () => ({
  useSettingsSummary: () => mockUseSettingsSummary(),
  useUpdateSettingsPreferences: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

describe("SettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading state while settings are loading", () => {
    mockUseSettingsSummary.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    renderWithProviders(<SettingsPage />);

    expect(screen.getByText("Loading settings...")).toBeInTheDocument();
  });

  it("shows an error state when settings fail to load", () => {
    mockUseSettingsSummary.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });

    renderWithProviders(<SettingsPage />);

    expect(screen.getByText("Settings are unavailable.")).toBeInTheDocument();
  });

  it("hydrates the form from backend settings data", async () => {
    mockUseSettingsSummary.mockReturnValue({
      data: {
        app: {
          name: "AgentOps API",
          environment: "development",
          version: "0.1.0",
        },
        preferences: {
          workspace_name: "AgentOps Demo",
          timezone: "Asia/Jerusalem",
          theme_preference: "dark",
          accent_color: "emerald",
        },
        capabilities: [],
        unavailable_features: [],
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderWithProviders(<SettingsPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("AgentOps Demo")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("Asia/Jerusalem")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Dark")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Emerald")).toBeInTheDocument();
  });

  it("keeps save disabled until the form changes", async () => {
    mockUseSettingsSummary.mockReturnValue({
      data: {
        app: {
          name: "AgentOps API",
          environment: "development",
          version: "0.1.0",
        },
        preferences: {
          workspace_name: "AgentOps Demo",
          timezone: "Asia/Jerusalem",
          theme_preference: "dark",
          accent_color: "emerald",
        },
        capabilities: [],
        unavailable_features: [],
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderWithProviders(<SettingsPage />);

    const saveButton = await screen.findByRole("button", {
      name: "Save Changes",
    });

    expect(saveButton).toBeDisabled();

    fireEvent.change(screen.getByDisplayValue("AgentOps Demo"), {
      target: { value: "AgentOps Workspace" },
    });

    expect(saveButton).not.toBeDisabled();
  });

  it("shows a success message after saving", async () => {
    const refetch = vi.fn();
    mockMutateAsync.mockResolvedValue({});

    mockUseSettingsSummary.mockReturnValue({
      data: {
        app: {
          name: "AgentOps API",
          environment: "development",
          version: "0.1.0",
        },
        preferences: {
          workspace_name: "AgentOps Demo",
          timezone: "Asia/Jerusalem",
          theme_preference: "dark",
          accent_color: "emerald",
        },
        capabilities: [],
        unavailable_features: [],
      },
      isLoading: false,
      isError: false,
      refetch,
    });

    renderWithProviders(<SettingsPage />);

    const saveButton = await screen.findByRole("button", {
      name: "Save Changes",
    });

    fireEvent.change(screen.getByDisplayValue("AgentOps Demo"), {
      target: { value: "AgentOps Workspace" },
    });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Settings saved.")).toBeInTheDocument();
    });

    expect(mockMutateAsync).toHaveBeenCalled();
    expect(refetch).toHaveBeenCalled();
  });

  it("shows an error message when saving fails", async () => {
    mockMutateAsync.mockRejectedValue(new Error("save failed"));

    mockUseSettingsSummary.mockReturnValue({
      data: {
        app: {
          name: "AgentOps API",
          environment: "development",
          version: "0.1.0",
        },
        preferences: {
          workspace_name: "AgentOps Demo",
          timezone: "Asia/Jerusalem",
          theme_preference: "dark",
          accent_color: "emerald",
        },
        capabilities: [],
        unavailable_features: [],
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderWithProviders(<SettingsPage />);

    const saveButton = await screen.findByRole("button", {
      name: "Save Changes",
    });

    fireEvent.change(screen.getByDisplayValue("AgentOps Demo"), {
      target: { value: "AgentOps Workspace" },
    });

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Unable to save settings.")).toBeInTheDocument();
    });
  });
});
