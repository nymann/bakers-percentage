import { useId, useState } from 'react'

type Options = {
  initialOpen?: boolean
}

type TriggerProps = {
  type: 'button'
  'aria-expanded': boolean
  'aria-controls': string
  onClick: () => void
}

type PanelProps = {
  id: string
  hidden: boolean
  role: 'region'
}

export type Disclosure = {
  isOpen: boolean
  toggle: () => void
  getTriggerProps: () => TriggerProps
  getPanelProps: () => PanelProps
}

export function useDisclosure({ initialOpen = false }: Options = {}): Disclosure {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const panelId = useId()

  const toggle = () => setIsOpen((prev) => !prev)

  return {
    isOpen,
    toggle,
    getTriggerProps: () => ({
      type: 'button',
      'aria-expanded': isOpen,
      'aria-controls': panelId,
      onClick: toggle,
    }),
    getPanelProps: () => ({
      id: panelId,
      hidden: !isOpen,
      role: 'region',
    }),
  }
}
