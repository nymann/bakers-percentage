import type { UseActiveView } from '../../../application/use-cases/useActiveView'
import { cn } from '../../../design-system/lib/utils'

interface BottomNavBarProps {
  view: UseActiveView
}

export function BottomNavBar({ view }: BottomNavBarProps) {
  return (
    <nav
      aria-label="Mobile views"
      role="navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-high border-t border-outline-variant/20"
    >
      <ul role="tablist" className="flex justify-around">
        {view.views.map((descriptor) => {
          const tabProps = view.getTabProps(descriptor.id)
          const isActive = tabProps['aria-selected']
          return (
            <li key={descriptor.id} className="flex-1">
              <button
                type="button"
                {...tabProps}
                className={cn(
                  'w-full py-3 flex flex-col items-center font-label uppercase tracking-widest text-[0.65rem] transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-on-surface',
                )}
              >
                {descriptor.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
