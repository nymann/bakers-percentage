import { cn } from '../lib/utils'

export interface LiveTimeProps {
  readonly value: string
  readonly className?: string
}

export function LiveTime({ value, className }: LiveTimeProps) {
  const tokens = value.split(' ')
  return (
    <span className={cn('inline-flex items-baseline gap-1 tabular-nums', className)}>
      {tokens.map((token, index) => (
        <span key={`${index}-${token}`} className="inline-block animate-tick">
          {token}
        </span>
      ))}
    </span>
  )
}
