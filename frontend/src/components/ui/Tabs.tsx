type TabItem = {
  label: string;
};

type TabsProps = {
  activeLabel: string;
  items: TabItem[];
  onChange: (label: string) => void;
};

export function Tabs({ activeLabel, items, onChange }: TabsProps) {
  return (
    <div
      aria-orientation="horizontal"
      className="flex overflow-x-auto border-b border-app-border"
      role="tablist"
    >
      {items.map((item) => {
        const isActive = item.label === activeLabel;

        return (
          <button
            aria-selected={isActive}
            className={[
              "relative h-12 shrink-0 px-5 text-sm font-medium transition",
              isActive
                ? "text-violet-200"
                : "text-slate-400 hover:text-slate-200",
            ].join(" ")}
            key={item.label}
            onClick={() => onChange(item.label)}
            role="tab"
            tabIndex={0}
            type="button"
          >
            {item.label}
            {isActive && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-violet-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}
