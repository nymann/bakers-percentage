import type { ReactNode } from 'react'
import { useDisclosure } from '../headless/useDisclosure'

export type DisclosureProps = {
  label: string
  children: ReactNode
  initialOpen?: boolean
}

export function Disclosure({ label, children, initialOpen = false }: DisclosureProps) {
  const disclosure = useDisclosure({ initialOpen })

  return (
    <div className="border border-outline-variant/20 rounded-xl overflow-hidden">
      <button
        {...disclosure.getTriggerProps()}
        className="w-full flex justify-between items-center p-4 font-label uppercase tracking-widest text-xs text-on-surface-variant bg-surface-container-low hover:bg-surface-container transition-colors"
      >
        <span>{label}</span>
        <span aria-hidden="true">{disclosure.isOpen ? '−' : '+'}</span>
      </button>
      <div
        {...disclosure.getPanelProps()}
        aria-label={label}
        className="p-6 space-y-4 bg-surface-container-lowest"
      >
        {children}
      </div>
    </div>
  )
}
