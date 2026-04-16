export type EmptyStateProps = {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-label={title}
      className="py-8 text-center text-on-surface-variant font-body italic"
    >
      <span className="block font-headline not-italic text-lg text-on-surface mb-1">
        {title}
      </span>
      {description !== undefined && (
        <p className="text-sm">{description}</p>
      )}
    </div>
  )
}
