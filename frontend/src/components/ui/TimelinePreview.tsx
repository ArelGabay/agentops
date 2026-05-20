import type { ReactNode } from 'react'

type TimelineItem = {
  label: string
  sublabel?: string
  duration: string
  left: number
  width: number
  tone: 'violet' | 'blue' | 'emerald' | 'amber' | 'cyan'
  icon: ReactNode
}

type TimelinePreviewProps = {
  items: TimelineItem[]
}

const toneStyles = {
  violet: 'bg-violet-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  cyan: 'bg-cyan-400',
}

export function TimelinePreview({ items }: TimelinePreviewProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px]">
        <div className="ml-[168px] grid grid-cols-6 text-xs text-slate-400">
          {['0s', '2s', '4s', '6s', '8s', '10s'].map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>

        <div className="relative mt-3">
          <div className="absolute bottom-0 left-[168px] top-0 grid w-[calc(100%-168px)] grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <span className="border-l border-slate-800" key={index} />
            ))}
          </div>

          <div className="relative space-y-3">
            {items.map((item) => {
              const barWidth = Math.min(item.width, 100 - item.left)
              const endsNearEdge = item.left + barWidth > 92

              return (
                <div className="grid grid-cols-[152px_1fr] items-center gap-4" key={item.label}>
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-slate-300">
                      {item.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-100">{item.label}</span>
                      {item.sublabel && (
                        <span className="block truncate text-xs text-slate-500">{item.sublabel}</span>
                      )}
                    </span>
                  </div>

                  <div className="relative h-11">
                    <div
                      className={[
                        'absolute top-3 flex h-6 min-w-14 items-center justify-center rounded-md px-2 text-xs font-medium text-white shadow-lg',
                        toneStyles[item.tone],
                      ].join(' ')}
                      style={endsNearEdge ? { right: 0, width: `${barWidth}%` } : { left: `${item.left}%`, width: `${barWidth}%` }}
                    >
                      {item.duration}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
