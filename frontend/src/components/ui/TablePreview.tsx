import type { ReactNode } from 'react'

type TablePreviewProps = {
  columns: string[]
  rows: ReactNode[][]
  minWidth?: string
}

export function TablePreview({ columns, rows, minWidth = '760px' }: TablePreviewProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-app-border">
      <div style={{ minWidth }}>
        <div
          className="grid items-center gap-4 bg-white/[0.03] px-4 py-3 text-xs font-medium uppercase text-slate-500"
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
        >
          {columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>

        {rows.map((row, rowIndex) => (
          <div
            className="grid items-center gap-4 border-t border-app-border px-4 py-3 text-sm"
            key={rowIndex}
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
          >
            {row.map((cell, cellIndex) => (
              <div className="min-w-0" key={cellIndex}>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
