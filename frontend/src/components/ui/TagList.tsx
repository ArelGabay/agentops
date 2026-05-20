type TagListProps = {
  tags: string[]
}

export function TagList({ tags }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span className="rounded-md bg-violet-500/15 px-2 py-1 text-xs font-medium text-violet-200" key={tag}>
          {tag}
        </span>
      ))}
    </div>
  )
}
