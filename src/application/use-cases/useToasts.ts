import { useCallback, useRef, useState } from 'react'

export interface Toast {
  readonly id: number
  readonly message: string
}

const DEFAULT_DURATION_MS = 3200

export interface UseToasts {
  readonly toasts: readonly Toast[]
  readonly showToast: (message: string) => void
  readonly dismiss: (id: number) => void
}

export function useToasts(durationMs: number = DEFAULT_DURATION_MS): UseToasts {
  const [toasts, setToasts] = useState<readonly Toast[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string) => {
      const id = nextId.current++
      setToasts((current) => [...current, { id, message }])
      if (typeof window !== 'undefined') {
        window.setTimeout(() => dismiss(id), durationMs)
      }
    },
    [dismiss, durationMs],
  )

  return { toasts, showToast, dismiss }
}
