import type { ReactNode } from 'react'
import { useToggleCard } from '../headless/useToggleCard'

export type ToggleCardProps = {
  label: string
  pressed: boolean
  onActivate: () => void
  children: ReactNode
}

export function ToggleCard({ label, pressed, onActivate, children }: ToggleCardProps) {
  const toggle = useToggleCard({ pressed, onActivate, label })

  return (
    <button
      {...toggle.getTriggerProps()}
      className={[
        'p-6 rounded-xl border-2 flex items-start gap-4 text-left transition-all',
        pressed
          ? 'border-primary bg-surface-container-lowest'
          : 'border-transparent bg-surface-container-low hover:border-outline-variant/30',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
