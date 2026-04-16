import { useState } from 'react'
import type { UseActiveView, ViewId } from '../../../application/use-cases/useActiveView'
import { cn } from '../../../design-system/lib/utils'

interface SideNavBarProps {
  view: UseActiveView
}

const VIEW_ICONS: Record<ViewId, string> = {
  planning: 'edit_note',
  execution: 'timer',
  history: 'history',
}

export function SideNavBar({ view }: SideNavBarProps) {
  const [expanded, setExpanded] = useState(true)
  const toggle = () => setExpanded((prev) => !prev)

  return (
    <aside
      aria-label="Primary shell"
      data-expanded={expanded}
      className={cn(
        'relative flex flex-col min-h-screen sticky top-0 bg-surface-container-high shadow-[20px_0_40px_rgba(49,51,44,0.05)] transition-[width] duration-200 ease-in-out',
        expanded ? 'w-60 sm:w-72' : 'w-20',
      )}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="side-nav-body"
        aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        onClick={toggle}
        className="absolute top-5 -right-3 w-6 h-6 rounded-full bg-surface-container-high border border-outline-variant/30 shadow-sm flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors z-10"
      >
        <span aria-hidden="true" className="material-symbols-outlined !text-[16px] leading-none">
          {expanded ? 'chevron_left' : 'chevron_right'}
        </span>
      </button>

      <div id="side-nav-body" className={cn('pt-8', expanded ? 'px-6 sm:px-8' : 'px-3')}>
        <header
          role="banner"
          className={cn(
            'flex items-center mb-10',
            expanded ? 'gap-3' : 'justify-center',
          )}
        >
          <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">bakery_dining</span>
          </div>
          {expanded && (
            <div className="overflow-hidden">
              <h2 className="font-headline text-xl italic text-primary leading-tight whitespace-nowrap">
                The Perfect Bread
              </h2>
              <p className="font-label uppercase tracking-widest text-[0.6rem] text-on-surface-variant whitespace-nowrap">
                Master Baker
              </p>
            </div>
          )}
        </header>

        <nav aria-label="Primary views" role="navigation">
          <ul role="tablist" aria-orientation="vertical" className="space-y-2">
            {view.views.map((descriptor) => {
              const tabProps = view.getTabProps(descriptor.id)
              const isActive = tabProps['aria-selected']
              const isDisabled = descriptor.disabled
              const icon = VIEW_ICONS[descriptor.id]
              const fullLabel = isDisabled
                ? `${descriptor.label} — coming soon`
                : descriptor.label
              const accessibleLabel = isDisabled || !expanded ? fullLabel : undefined
              return (
                <li key={descriptor.id}>
                  <button
                    type="button"
                    {...tabProps}
                    title={expanded ? (isDisabled ? 'Coming soon' : undefined) : fullLabel}
                    aria-label={accessibleLabel}
                    className={cn(
                      'w-full flex items-center font-label uppercase tracking-widest text-[0.75rem] transition-all',
                      expanded
                        ? 'gap-3 py-3 pl-5 rounded-r-xl'
                        : 'justify-center py-3 rounded-xl',
                      isDisabled
                        ? 'text-on-surface-variant/40 cursor-not-allowed'
                        : isActive
                        ? expanded
                          ? 'text-on-surface font-bold border-l-4 border-primary bg-surface-container-low/70'
                          : 'text-on-surface bg-surface-container-low/70 ring-1 ring-primary/40'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low/50',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined !text-[20px] leading-none"
                    >
                      {icon}
                    </span>
                    {expanded && (
                      <span className="flex items-baseline gap-2">
                        <span>{descriptor.label}</span>
                        {isDisabled && (
                          <span className="font-label text-[0.55rem] tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant/70">
                            Soon
                          </span>
                        )}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
