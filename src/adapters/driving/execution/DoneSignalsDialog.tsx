import { useEffect, useRef, useState } from 'react'

const DIALOG_HEADING_ID = 'done-signals-dialog-heading'

export function DoneSignalsDialog() {
  const [open, setOpen] = useState(false)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    closeBtnRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-3 px-5 py-4 rounded-2xl bg-primary-container/40 border border-primary/30 text-on-surface font-label uppercase tracking-widest text-[0.75rem] hover:bg-primary-container/60 transition-colors"
        aria-haspopup="dialog"
      >
        <span aria-hidden="true" className="material-symbols-outlined !text-[20px] text-primary">
          help_outline
        </span>
        Is it done?
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={DIALOG_HEADING_ID}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <div className="max-w-xl w-full max-h-[90vh] overflow-y-auto bg-surface-container-lowest rounded-2xl shadow-[0_20px_60px_rgba(49,51,44,0.25)] p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <h2
                id={DIALOG_HEADING_ID}
                className="font-headline text-2xl italic text-on-surface"
              >
                Knowing it&rsquo;s done
              </h2>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low"
              >
                <span aria-hidden="true" className="material-symbols-outlined !text-[18px]">
                  close
                </span>
              </button>
            </div>

            <DoneSignalsContent />
          </div>
        </div>
      )}
    </>
  )
}

function DoneSignalsContent() {
  return (
    <div className="space-y-6">
      <section>
        <p className="font-body text-sm text-on-surface-variant mb-3">
          For lean hearth, the crust is the primary signal. The thermometer
          tells you the crumb has set — not that the bake is finished.
        </p>
        <ul className="font-body text-sm text-on-surface-variant space-y-2 list-disc pl-5 marker:text-on-surface-variant/40">
          <li>
            <span className="text-on-surface">Crust colour (primary)</span> —
            deep mahogany, no pale patches on the sides or under the ears.
            Darker than feels safe.
          </li>
          <li>
            <span className="text-on-surface">Weight in hand</span> —
            noticeably lighter than when it went in. Water has been driven
            off.
          </li>
          <li>
            <span className="text-on-surface">Knock on the bottom</span> — a
            hollow thump means the interior has set and vapour has vented.
          </li>
          <li>
            <span className="text-on-surface">Internal temperature</span> —
            96–99&nbsp;&deg;C marks the crumb as gelatinised. Use it to rule
            out underbaking, not to call the bake done.
          </li>
        </ul>
        <p className="font-body text-sm text-on-surface-variant mt-3">
          <span className="text-on-surface">Crust vs keeping trade&shy;off.</span>{' '}
          Baking darker deepens colour and flavour but accelerates starch
          retrogradation. For today&rsquo;s meal, push the crust dark. For
          tomorrow, pull at the lower end of done, or freeze once cool.
        </p>
      </section>

      <section>
        <h3 className="font-label text-[0.8rem] uppercase tracking-widest text-on-surface mb-2">
          After the oven
        </h3>
        <ul className="font-body text-sm text-on-surface-variant space-y-2 list-disc pl-5 marker:text-on-surface-variant/40">
          <li>
            <span className="text-on-surface">Cool to ~35&nbsp;&deg;C internal before slicing.</span>{' '}
            1.5–2 h for loaves over 1&nbsp;kg. Slicing earlier locks in a
            gummy crumb.
          </li>
          <li>
            <span className="text-on-surface">Don&rsquo;t package hot.</span>{' '}
            Condensation softens the crust and seeds mould within 24–48&nbsp;h.
          </li>
          <li>
            <span className="text-on-surface">Never refrigerate.</span> Starch
            retrogrades fastest at fridge temperature (~4&nbsp;&deg;C).
          </li>
          <li>
            <span className="text-on-surface">Day 1–2</span> — paper bag or
            bread box. Slows surface drying without trapping moisture.
          </li>
          <li>
            <span className="text-on-surface">Beyond day 2–3</span> — slice
            and freeze. Freezing pauses retrogradation; toasting from frozen
            refreshes cleanly.
          </li>
        </ul>
      </section>
    </div>
  )
}
