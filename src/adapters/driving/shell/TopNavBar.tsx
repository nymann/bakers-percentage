import type { UseActiveView, ViewId } from '../../../application/use-cases/useActiveView'
import { cn } from '../../../design-system/lib/utils'

interface TopNavBarProps {
  view: UseActiveView
  onOpenSettings: () => void
}

const VIEW_ICONS: Record<ViewId, string> = {
  planning: 'edit_note',
  execution: 'timer',
  history: 'history',
}

export function TopNavBar({ view, onOpenSettings }: TopNavBarProps) {
  return (
    <header
      role="banner"
      aria-label="Primary shell"
      className="sticky top-0 z-20 flex items-center gap-2 px-3 py-2 bg-surface-container-high shadow-[0_12px_24px_rgba(49,51,44,0.05)]"
    >
      <div className="flex items-center gap-2 shrink-0 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary !text-[20px]">
            bakery_dining
          </span>
        </div>
        <h2 className="font-headline text-base italic text-primary leading-tight truncate">
          The Perfect Bread
        </h2>
      </div>

      <nav aria-label="Primary views" role="navigation" className="flex-1 min-w-0">
        <ul role="tablist" aria-orientation="horizontal" className="flex justify-end gap-1">
          {view.views.map((descriptor) => {
            const tabProps = view.getTabProps(descriptor.id)
            const isActive = tabProps['aria-selected']
            const isDisabled = descriptor.disabled
            const icon = VIEW_ICONS[descriptor.id]
            const label = isDisabled
              ? `${descriptor.label} — coming soon`
              : descriptor.label
            return (
              <li key={descriptor.id}>
                <button
                  type="button"
                  {...tabProps}
                  title={label}
                  aria-label={label}
                  className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-xl transition-colors',
                    isDisabled
                      ? 'text-on-surface-variant/40 cursor-not-allowed'
                      : isActive
                      ? 'text-on-surface bg-surface-container-low/70 ring-1 ring-primary/40'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low/50',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined !text-[20px] leading-none"
                  >
                    {icon}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <button
        type="button"
        onClick={onOpenSettings}
        aria-label="Settings"
        title="Settings"
        className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low/50 transition-colors shrink-0"
      >
        <span
          aria-hidden="true"
          className="material-symbols-outlined !text-[20px] leading-none"
        >
          settings
        </span>
      </button>
    </header>
  )
}
