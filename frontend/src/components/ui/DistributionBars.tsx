type DistributionItem = {
  label: string
  value: string
  height: number
}

type DistributionBarsProps = {
  items: DistributionItem[]
}

export function DistributionBars({ items }: DistributionBarsProps) {
  return (
    <div className="flex h-48 items-end gap-5">
      {items.map((item) => (
        <div className="flex flex-1 flex-col items-center gap-3" key={item.label}>
          <span className="text-xs text-slate-300">{item.value}</span>
          <div className="flex h-32 w-full items-end rounded-t">
            <div
              className="w-full rounded-t bg-violet-500 shadow-lg shadow-violet-950/30"
              style={{ height: `${item.height}%` }}
            />
          </div>
          <span className="whitespace-nowrap text-xs text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
