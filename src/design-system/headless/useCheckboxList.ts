import { useCallback, useMemo, useState } from 'react'

export interface CheckboxListItem {
  readonly label: string
  readonly checked: boolean
}

export interface UseCheckboxListOptions {
  readonly items: readonly string[]
}

export interface UseCheckboxList {
  readonly items: readonly CheckboxListItem[]
  toggle: (index: number) => void
}

export function useCheckboxList({ items }: UseCheckboxListOptions): UseCheckboxList {
  const [checked, setChecked] = useState<readonly boolean[]>(() =>
    items.map(() => false),
  )

  const toggle = useCallback((index: number) => {
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)))
  }, [])

  const mapped = useMemo<readonly CheckboxListItem[]>(
    () =>
      items.map((label, index) => ({
        label,
        checked: checked[index] ?? false,
      })),
    [items, checked],
  )

  return useMemo(() => ({ items: mapped, toggle }), [mapped, toggle])
}
