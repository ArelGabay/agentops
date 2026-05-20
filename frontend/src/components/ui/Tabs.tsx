type TabItem = {
  label: string
  active?: boolean
}

type TabsProps = {
  items: TabItem[]
}

export function Tabs({ items }: TabsProps) {
  return (
    <div className="flex overflow-x-auto border-b border-app-border">
      {items.map((item) => (
        <button
          className={[
            'relative h-12 shrink-0 px-5 text-sm font-medium transition',
            item.active ? 'text-violet-200' : 'text-slate-400 hover:text-slate-200',
          ].join(' ')}
          key={item.label}
          type="button"
        >
          {item.label}
          {item.active && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-violet-500" />}
        </button>
      ))}
    </div>
  )
}
