import type { UseActiveView } from '../../../application/use-cases/useActiveView'

interface TopAppBarProps {
  view: UseActiveView
}

export function TopAppBar({ view }: TopAppBarProps) {
  const current = view.views.find((v) => v.id === view.activeView)
  return (
    <header
      role="banner"
      className="fixed top-0 w-full z-50 bg-background text-on-surface border-b border-outline-variant/20"
    >
      <div className="flex justify-between items-center px-6 h-20 w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-headline italic text-on-surface">
            The Editorial Kitchen
          </span>
        </div>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <span
            aria-live="polite"
            className="hidden sm:inline font-label uppercase tracking-widest text-[0.7rem]"
          >
            {current?.label}
          </span>
        </div>
      </div>
    </header>
  )
}
