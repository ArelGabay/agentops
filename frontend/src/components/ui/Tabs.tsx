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
    <div className="flex overflow-x-auto border-b border-app-border">
      {items.map((item) => {
        const isActive = item.label === activeLabel;

        return (
          <button
            className={[
              "relative h-12 shrink-0 px-5 text-sm font-medium transition",
              isActive
                ? "text-violet-200"
                : "text-slate-400 hover:text-slate-200",
            ].join(" ")}
            key={item.label}
            onClick={() => onChange(item.label)}
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
