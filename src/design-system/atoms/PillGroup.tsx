import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useSegmented } from '../headless/useSegmented'
import { cn } from '../lib/utils'

export type PillOption<T extends string> = {
  readonly value: T
  readonly label: string
  readonly content?: ReactNode
}

export interface PillGroupProps<T extends string> {
  readonly ariaLabel: string
  readonly options: readonly PillOption<T>[]
  readonly value: T | null
  readonly onChange: (value: T) => void
  readonly stretch?: boolean
  readonly className?: string
}

type ThumbRect = { left: number; width: number }

function measureThumb<T extends string>(
  value: T | null,
  nodes: Map<T, HTMLElement>,
  container: HTMLElement | null,
): ThumbRect | null {
  if (value === null || !container) return null
  const btn = nodes.get(value)
  if (!btn) return null
  const bRect = btn.getBoundingClientRect()
  const cRect = container.getBoundingClientRect()
  return { left: bRect.left - cRect.left, width: bRect.width }
}

export function PillGroup<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
  stretch = false,
  className,
}: PillGroupProps<T>) {
  const segmented = useSegmented({
    options,
    value,
    onChange,
    label: ariaLabel,
  })
  const containerRef = useRef<HTMLDivElement | null>(null)
  const optionNodes = useRef<Map<T, HTMLButtonElement>>(new Map())
  const [thumb, setThumb] = useState<ThumbRect | null>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  const optionsKey = options.map((o) => o.value).join('|')

  useLayoutEffect(() => {
    const nextThumb = measureThumb(value, optionNodes.current, containerRef.current)
    setThumb(nextThumb)
  }, [value, optionsKey])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => {
      const next = measureThumb(value, optionNodes.current, container)
      setThumb(next)
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [value])

  useEffect(() => {
    if (thumb && !hasAnimated) {
      const raf = requestAnimationFrame(() => setHasAnimated(true))
      return () => cancelAnimationFrame(raf)
    }
    return undefined
  }, [thumb, hasAnimated])

  return (
    <div
      {...segmented.getRootProps()}
      ref={containerRef}
      className={cn(
        'relative flex gap-0.5 bg-surface-container-low rounded-full p-1',
        className,
      )}
    >
      {thumb && (
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-1 bottom-1 left-0 rounded-full bg-primary shadow-sm pointer-events-none will-change-transform',
            hasAnimated
              ? 'transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]'
              : '',
          )}
          style={{
            transform: `translateX(${thumb.left}px)`,
            width: thumb.width,
          }}
        />
      )}
      {options.map((option) => {
        const props = segmented.getOptionProps(option.value)
        const isSelected = value === option.value
        return (
          <button
            type="button"
            key={option.value}
            {...props}
            ref={(node) => {
              props.ref(node)
              if (node) optionNodes.current.set(option.value, node)
              else optionNodes.current.delete(option.value)
            }}
            aria-label={option.label}
            className={cn(
              'relative z-10 px-3 py-1.5 rounded-full text-xs font-label transition-colors duration-200',
              stretch ? 'flex-1' : 'whitespace-nowrap',
              isSelected
                ? 'text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface',
            )}
          >
            {option.content ?? option.label}
          </button>
        )
      })}
    </div>
  )
}
