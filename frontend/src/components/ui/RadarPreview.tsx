export function RadarPreview() {
  return (
    <div className="flex h-60 items-center justify-center">
      <svg className="h-full max-h-56 w-full max-w-72" viewBox="0 0 260 220" role="img" aria-label="Static radar chart preview">
        <g fill="none" stroke="#334155" strokeWidth="1">
          <polygon points="130,20 218,70 218,150 130,200 42,150 42,70" />
          <polygon points="130,50 190,84 190,136 130,170 70,136 70,84" />
          <polygon points="130,80 162,98 162,122 130,140 98,122 98,98" />
          <line x1="130" x2="130" y1="20" y2="200" />
          <line x1="42" x2="218" y1="70" y2="150" />
          <line x1="218" x2="42" y1="70" y2="150" />
        </g>
        <polygon
          fill="rgb(139 92 246 / 0.28)"
          points="130,44 190,86 174,136 130,162 76,134 96,90"
          stroke="#8b5cf6"
          strokeWidth="3"
        />
        {[
          ['Correctness', 130, 12],
          ['Relevance', 228, 70],
          ['Completeness', 230, 154],
          ['Coherence', 130, 216],
          ['Safety', 22, 154],
          ['Hallucination', 18, 70],
        ].map(([label, x, y]) => (
          <text className="fill-slate-300 text-[10px]" key={label} textAnchor="middle" x={x} y={y}>
            {label}
          </text>
        ))}
      </svg>
    </div>
  )
}
