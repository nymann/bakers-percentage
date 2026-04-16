import type { ReactNode } from 'react'
import { useSegmented, type SegmentedOption } from '../headless/useSegmented'

export type SegmentedSelectorProps<T extends string> = {
  label: string
  options: readonly SegmentedOption<T>[]
  value: T | null
  onChange: (value: T) => void
  renderOption?: (option: SegmentedOption<T>, isSelected: boolean) => ReactNode
}

export function SegmentedSelector<T extends string>({
  label,
  options,
  value,
  onChange,
  renderOption,
}: SegmentedSelectorProps<T>) {
  const segmented = useSegmented({ options, value, onChange, label })

  return (
    <div {...segmented.getRootProps()} className="flex gap-2 flex-wrap">
      {options.map((option) => {
        const props = segmented.getOptionProps(option.value)
        const isSelected = value === option.value
        return (
          <button
            key={option.value}
            {...props}
            aria-label={option.label}
            className={[
              'flex-1 min-w-20 p-4 rounded-xl text-center transition-all font-label',
              isSelected
                ? 'bg-primary text-on-primary ring-4 ring-primary/10'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container',
            ].join(' ')}
          >
            {renderOption ? renderOption(option, isSelected) : option.label}
          </button>
        )
      })}
    </div>
  )
}
