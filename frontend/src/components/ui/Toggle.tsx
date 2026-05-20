type ToggleProps = {
  checked?: boolean
}

export function Toggle({ checked = false }: ToggleProps) {
  return (
    <span
      className={[
        'inline-flex h-6 w-11 items-center rounded-full border p-0.5 transition',
        checked ? 'border-violet-500 bg-violet-600' : 'border-app-border bg-white/[0.04]',
      ].join(' ')}
    >
      <span
        className={[
          'h-5 w-5 rounded-full bg-white shadow-sm transition',
          checked ? 'translate-x-5' : 'translate-x-0 bg-slate-300',
        ].join(' ')}
      />
    </span>
  )
}
