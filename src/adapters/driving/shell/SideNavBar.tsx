import type { UseActiveView } from '../../../application/use-cases/useActiveView'
import { cn } from '../../../design-system/lib/utils'

interface SideNavBarProps {
  view: UseActiveView
}

export function SideNavBar({ view }: SideNavBarProps) {
  return (
    <aside className="hidden lg:flex flex-col h-[calc(100vh-5rem)] sticky top-20 w-72 bg-surface-container-high shadow-[20px_0_40px_rgba(49,51,44,0.05)] transition-all duration-200 ease-in-out">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">kitchen</span>
          </div>
          <div>
            <h2 className="font-headline text-xl italic text-primary">The Kitchen</h2>
            <p className="font-label uppercase tracking-widest text-[0.6rem] text-on-surface-variant">
              Master Baker
            </p>
          </div>
        </div>
        <nav aria-label="Primary views" role="navigation">
          <ul role="tablist" aria-orientation="vertical" className="space-y-2">
            {view.views.map((descriptor) => {
              const tabProps = view.getTabProps(descriptor.id)
              const isActive = tabProps['aria-selected']
              return (
                <li key={descriptor.id}>
                  <button
                    type="button"
                    {...tabProps}
                    className={cn(
                      'w-full flex items-center gap-3 py-3 pl-5 rounded-r-xl font-label uppercase tracking-widest text-[0.75rem] transition-all',
                      isActive
                        ? 'text-on-surface font-bold border-l-4 border-primary bg-surface-container-low/70'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low/50',
                    )}
                  >
                    {descriptor.label}
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
