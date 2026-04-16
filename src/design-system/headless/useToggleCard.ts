type Options = {
  pressed: boolean
  onActivate: () => void
  label: string
}

type TriggerProps = {
  type: 'button'
  role: 'button'
  'aria-pressed': boolean
  'aria-label': string
  onClick: () => void
}

export type ToggleCard = {
  getTriggerProps: () => TriggerProps
  isPressed: boolean
}

export function useToggleCard({ pressed, onActivate, label }: Options): ToggleCard {
  return {
    isPressed: pressed,
    getTriggerProps: () => ({
      type: 'button',
      role: 'button',
      'aria-pressed': pressed,
      'aria-label': label,
      onClick: onActivate,
    }),
  }
}
