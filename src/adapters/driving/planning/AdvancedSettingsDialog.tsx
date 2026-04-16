import { useEffect, useId, useRef } from 'react'
import type { ClampResult } from '../../../domain/InputRanges'
import { SaltField } from './fields/SaltField'
import { BakeOffLossField } from './fields/BakeOffLossField'
import { StarterHydrationField } from './fields/StarterHydrationField'
import { StarterPercentField } from './fields/StarterPercentField'

export interface AdvancedSettingsDialogProps {
  isOpen: boolean
  onClose: () => void

  salt: number
  saltClampNote: ClampResult
  onChangeSalt: (fraction: number) => void

  bakeOffLoss: number
  bakeOffLossClampNote: ClampResult
  onChangeBakeOffLoss: (fraction: number) => void

  showSourdoughFields: boolean
  leavingType: 'sourdough' | 'yeast'

  starterHydration: number
  starterHydrationClampNote: ClampResult
  onChangeStarterHydration: (ratio: number) => void

  starterPercent: number
  starterPercentClampNote: ClampResult
  onChangeStarterPercent: (fraction: number) => void
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <h3 className="font-label text-[0.65rem] uppercase tracking-widest text-on-surface-variant">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function SectionDivider() {
  return <hr className="border-t border-outline-variant/10" />
}

export function AdvancedSettingsDialog(props: AdvancedSettingsDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const canShowModal = typeof dialog.showModal === 'function'
    if (props.isOpen) {
      if (canShowModal && !dialog.open) dialog.showModal()
      else if (!canShowModal) dialog.setAttribute('open', '')
    } else {
      if (canShowModal && dialog.open) dialog.close()
      else if (!canShowModal) dialog.removeAttribute('open')
    }
  }, [props.isOpen])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === ref.current) props.onClose()
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={props.onClose}
      onClick={handleBackdropClick}
      className="w-[28rem] max-w-[calc(100vw-2rem)] p-0 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest text-on-surface shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <header className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15">
        <h2
          id={titleId}
          className="font-label uppercase tracking-widest text-xs text-on-surface-variant"
        >
          Advanced settings
        </h2>
        <button
          type="button"
          aria-label="Close advanced settings"
          onClick={props.onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
        >
          <span aria-hidden="true" className="material-symbols-outlined !text-[18px]">
            close
          </span>
        </button>
      </header>
      <div className="p-6 space-y-6">
        <Section title="Recipe">
          <SaltField
            saltPercent={props.salt}
            onChange={props.onChangeSalt}
            clampNote={props.saltClampNote}
          />
          <SectionDivider />
          <BakeOffLossField
            bakeOffLoss={props.bakeOffLoss}
            onChange={props.onChangeBakeOffLoss}
            clampNote={props.bakeOffLossClampNote}
          />
        </Section>
        {props.showSourdoughFields && (
          <Section title="Starter">
            <StarterHydrationField
              starterHydration={props.starterHydration}
              onChange={props.onChangeStarterHydration}
              clampNote={props.starterHydrationClampNote}
              resetKey={props.leavingType}
            />
            <SectionDivider />
            <StarterPercentField
              percent={props.starterPercent}
              onChange={props.onChangeStarterPercent}
              clampNote={props.starterPercentClampNote}
              resetKey={props.leavingType}
            />
          </Section>
        )}
      </div>
    </dialog>
  )
}
