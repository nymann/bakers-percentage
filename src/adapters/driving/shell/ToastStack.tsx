import type { Toast } from '../../../application/use-cases/useToasts'

export interface ToastStackProps {
  toasts: readonly Toast[]
  onDismiss: (id: number) => void
}

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Notifications"
      className="fixed inset-x-0 bottom-4 sm:bottom-6 z-50 flex flex-col items-center gap-2 pointer-events-none px-4"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className="pointer-events-auto animate-toast-in flex items-center gap-3 px-5 py-3 rounded-full bg-inverse-surface text-inverse-primary font-body text-sm shadow-[0_20px_40px_rgba(14,14,12,0.28)] max-w-[calc(100vw-2rem)]"
        >
          <span
            aria-hidden="true"
            className="material-symbols-outlined !text-[18px] text-tertiary-fixed"
          >
            auto_awesome
          </span>
          <span className="min-w-0 truncate">{toast.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="p-1 rounded-full text-inverse-primary/60 hover:text-inverse-primary hover:bg-white/10 transition-colors"
          >
            <span aria-hidden="true" className="material-symbols-outlined !text-[16px]">
              close
            </span>
          </button>
        </div>
      ))}
    </div>
  )
}
