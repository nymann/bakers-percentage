import { useState, type ReactElement, type ReactNode } from 'react'
import { useNumberInput } from '../../../design-system/headless/useNumberInput'
import { useSegmented } from '../../../design-system/headless/useSegmented'
import { cn } from '../../../design-system/lib/utils'
import { PillGroup, type PillOption } from '../../../design-system/atoms/PillGroup'
import { HYDRATION_PRESETS, type HydrationPresetName } from '../../../domain/Hydration'
import type { ClampResult } from '../../../domain/InputRanges'
import { FinishedWeightField } from './fields/FinishedWeightField'
import { ClampNote } from './ClampNote'
import { CustomHydrationInput } from './EditorialPlanningView'

type WeightPresetValue = 'S' | 'M' | 'L'
type SizeOption = WeightPresetValue | 'Custom'

export type FermentChoice = 'sourdough' | 'fresh-yeast' | 'dry-yeast'
export type HydrationOptionValue = HydrationPresetName | 'Custom'

export interface SetupStepPanelProps {
  readonly selectedPreset: WeightPresetValue | null
  readonly weight: number
  readonly weightClampNote: ClampResult
  readonly onSelectPreset: (value: WeightPresetValue) => void
  readonly onChangeWeight: (grams: number) => void

  readonly loaves: number
  readonly loavesClampNote: ClampResult
  readonly onChangeLoaves: (count: number) => void

  readonly fermentChoice: FermentChoice
  readonly onSelectFerment: (choice: FermentChoice) => void

  readonly selectedHydration: HydrationOptionValue
  readonly hydrationPercent: number
  readonly onSelectHydrationPreset: (preset: HydrationPresetName) => void
  readonly onUnlockCustomHydration: () => void
  readonly onEnterCustomHydration: (fraction: number) => void
}

interface WeightPreset {
  readonly value: WeightPresetValue
  readonly label: string
  readonly grams: number
  readonly caption: string
  readonly Icon: (props: { className?: string }) => ReactElement
}

const WEIGHT_PRESETS: readonly WeightPreset[] = [
  { value: 'S', label: 'S', grams: 500, caption: 'Boule · one loaf', Icon: BouleIcon },
  { value: 'M', label: 'M', grams: 900, caption: 'Bâtard · supper bread', Icon: BatardIcon },
  { value: 'L', label: 'L', grams: 1200, caption: 'Miche · feast', Icon: MicheIcon },
]

interface FermentTileDef {
  readonly value: FermentChoice
  readonly label: string
  readonly caption: string
  readonly Icon: (props: { className?: string }) => ReactElement
}

const FERMENT_TILES: readonly FermentTileDef[] = [
  { value: 'sourdough', label: 'Sourdough', caption: 'Wild levain · long ferment', Icon: SourdoughIcon },
  { value: 'fresh-yeast', label: 'Fresh yeast', caption: 'Cake yeast · medium ferment', Icon: FreshYeastIcon },
  { value: 'dry-yeast', label: 'Dry yeast', caption: 'Instant · quick ferment', Icon: DryYeastIcon },
]

export function SetupStepPanel(props: SetupStepPanelProps) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <header className="space-y-2 px-1">
        <h2 className="font-headline italic text-3xl md:text-4xl text-on-surface">
          What are you baking?
        </h2>
        <p className="font-body text-sm md:text-base text-on-surface-variant max-w-xl">
          Pick the shape, count, leavening, and hydration. Timing and the formula come next.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-6">
        <SetupCard title="Size" caption="How big is each loaf?" className="md:col-span-4">
          <SizeTiles
            selectedPreset={props.selectedPreset}
            weight={props.weight}
            onSelectPreset={props.onSelectPreset}
            onChangeWeight={props.onChangeWeight}
            weightClampNote={props.weightClampNote}
          />
        </SetupCard>

        <SetupCard title="Loaves" caption="How many?" className="md:col-span-2">
          <LoavesStepper
            loaves={props.loaves}
            onChange={props.onChangeLoaves}
            clampNote={props.loavesClampNote}
          />
        </SetupCard>

        <SetupCard
          title="Ferment"
          caption="Which leavening agent are you using today?"
          className="md:col-span-6"
        >
          <FermentTiles
            value={props.fermentChoice}
            onChange={props.onSelectFerment}
          />
        </SetupCard>

        <SetupCard
          title="Hydration"
          caption="Water as a percentage of the flour."
          className="md:col-span-6"
        >
          <HydrationTiles
            selectedOption={props.selectedHydration}
            customPercent={props.hydrationPercent}
            onSelectPreset={props.onSelectHydrationPreset}
            onUnlockCustom={props.onUnlockCustomHydration}
            onEnterCustom={props.onEnterCustomHydration}
          />
        </SetupCard>
      </div>
    </div>
  )
}

function SetupCard({
  title,
  caption,
  className,
  children,
}: {
  title: string
  caption: string
  className?: string
  children: ReactNode
}) {
  return (
    <section
      className={cn(
        'bg-surface-container-lowest rounded-3xl border border-outline-variant/15 p-5 md:p-6',
        className,
      )}
    >
      <header className="mb-4">
        <h3 className="font-headline italic text-lg md:text-xl text-on-surface">
          {title}
        </h3>
        <p className="font-body text-xs md:text-sm text-on-surface-variant mt-0.5">
          {caption}
        </p>
      </header>
      {children}
    </section>
  )
}

function SizeTiles({
  selectedPreset,
  weight,
  onSelectPreset,
  onChangeWeight,
  weightClampNote,
}: {
  selectedPreset: WeightPresetValue | null
  weight: number
  onSelectPreset: (value: WeightPresetValue) => void
  onChangeWeight: (grams: number) => void
  weightClampNote: ClampResult
}) {
  const [customMode, setCustomMode] = useState(selectedPreset === null)
  const selection: SizeOption = customMode || selectedPreset === null ? 'Custom' : selectedPreset

  const options: readonly { value: SizeOption; label: string }[] = [
    ...WEIGHT_PRESETS.map((p) => ({ value: p.value, label: p.label })),
    { value: 'Custom', label: 'Custom' },
  ]

  const segmented = useSegmented<SizeOption>({
    options,
    value: selection,
    onChange: (value) => {
      if (value === 'Custom') {
        setCustomMode(true)
      } else {
        setCustomMode(false)
        onSelectPreset(value)
      }
    },
    label: 'Finished weight',
  })

  return (
    <div className="space-y-3">
      <div
        {...segmented.getRootProps()}
        className="grid grid-cols-2 sm:grid-cols-4 gap-2"
      >
        {WEIGHT_PRESETS.map((preset) => {
          const isSelected = selection === preset.value
          const optionProps = segmented.getOptionProps(preset.value)
          return (
            <button
              type="button"
              key={preset.value}
              {...optionProps}
              aria-label={preset.label}
              className={cn(
                'group flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-3 py-4 transition-colors',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                isSelected
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-low text-on-surface-variant border-outline-variant/20 hover:bg-surface-container hover:text-on-surface',
              )}
            >
              <preset.Icon className="w-8 h-8" />
              <span className="font-headline italic text-lg leading-none">
                {preset.label}
              </span>
              <span className="font-label text-[0.68rem] uppercase tracking-widest opacity-80">
                {preset.grams} g
              </span>
              <span
                className={cn(
                  'font-body text-[0.7rem] leading-tight text-center',
                  isSelected ? 'text-on-primary/80' : 'text-on-surface-variant/70',
                )}
              >
                {preset.caption}
              </span>
            </button>
          )
        })}
        {(() => {
          const optionProps = segmented.getOptionProps('Custom')
          const isSelected = selection === 'Custom'
          return (
            <button
              type="button"
              key="Custom"
              {...optionProps}
              aria-label="Custom"
              className={cn(
                'flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-3 py-4 transition-colors',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                isSelected
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-low text-on-surface-variant border-outline-variant/20 hover:bg-surface-container hover:text-on-surface',
              )}
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined !text-[28px]"
              >
                tune
              </span>
              <span className="font-headline italic text-lg leading-none">Custom</span>
              <span className="font-label text-[0.68rem] uppercase tracking-widest opacity-80">
                any weight
              </span>
              <span
                className={cn(
                  'font-body text-[0.7rem] leading-tight text-center',
                  isSelected ? 'text-on-primary/80' : 'text-on-surface-variant/70',
                )}
              >
                dial it in by the gram
              </span>
            </button>
          )
        })()}
      </div>
      {customMode && (
        <div className="animate-slide-up-fade">
          <FinishedWeightField
            weight={weight}
            onChange={onChangeWeight}
            clampNote={weightClampNote}
            resetKey="custom"
          />
        </div>
      )}
    </div>
  )
}

function FermentTiles({
  value,
  onChange,
}: {
  value: FermentChoice
  onChange: (choice: FermentChoice) => void
}) {
  const options = FERMENT_TILES.map((t) => ({ value: t.value, label: t.label }))
  const segmented = useSegmented<FermentChoice>({
    options,
    value,
    onChange,
    label: 'Fermentation path',
  })

  return (
    <div
      {...segmented.getRootProps()}
      className="grid grid-cols-1 sm:grid-cols-3 gap-2"
    >
      {FERMENT_TILES.map((tile) => {
        const isSelected = value === tile.value
        const optionProps = segmented.getOptionProps(tile.value)
        return (
          <button
            type="button"
            key={tile.value}
            {...optionProps}
            aria-label={tile.label}
            className={cn(
              'flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-colors',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              isSelected
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container-low text-on-surface-variant border-outline-variant/20 hover:bg-surface-container hover:text-on-surface',
            )}
          >
            <tile.Icon className="w-8 h-8 shrink-0" />
            <span className="flex flex-col min-w-0">
              <span className="font-headline italic text-base leading-tight">
                {tile.label}
              </span>
              <span
                className={cn(
                  'font-body text-xs leading-tight',
                  isSelected ? 'text-on-primary/80' : 'text-on-surface-variant/80',
                )}
              >
                {tile.caption}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

function HydrationTiles({
  selectedOption,
  customPercent,
  onSelectPreset,
  onUnlockCustom,
  onEnterCustom,
}: {
  selectedOption: HydrationOptionValue
  customPercent: number
  onSelectPreset: (preset: HydrationPresetName) => void
  onUnlockCustom: () => void
  onEnterCustom: (fraction: number) => void
}) {
  const options: PillOption<HydrationOptionValue>[] = [
    ...HYDRATION_PRESETS.map<PillOption<HydrationOptionValue>>((p) => ({
      value: p.name,
      label: `${p.name} — ${Math.round(p.percentage * 100)}%`,
    })),
    { value: 'Custom', label: 'Custom' },
  ]

  return (
    <div className="space-y-3">
      <PillGroup<HydrationOptionValue>
        ariaLabel="Hydration"
        options={options}
        value={selectedOption}
        onChange={(value) => {
          if (value === 'Custom') onUnlockCustom()
          else onSelectPreset(value)
        }}
        stretch
        className="!p-1.5"
      />
      {selectedOption === 'Custom' && (
        <div className="animate-slide-up-fade">
          <CustomHydrationInput
            percentage={customPercent}
            onChange={onEnterCustom}
          />
        </div>
      )}
    </div>
  )
}

function LoavesStepper({
  loaves,
  onChange,
  clampNote,
}: {
  loaves: number
  onChange: (count: number) => void
  clampNote: ClampResult
}) {
  const input = useNumberInput({ value: loaves, onChange })
  const decrement = () => onChange(Math.max(1, loaves - 1))
  const increment = () => onChange(loaves + 1)
  const canDecrement = loaves > 1

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-4 w-full">
        <button
          type="button"
          aria-label="Decrease loaf count"
          onClick={decrement}
          disabled={!canDecrement}
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            canDecrement
              ? 'bg-surface-container-low text-on-surface hover:bg-surface-container'
              : 'bg-surface-container-low text-on-surface-variant/40 cursor-not-allowed',
          )}
        >
          <span aria-hidden="true" className="material-symbols-outlined !text-[22px] leading-none">
            remove
          </span>
        </button>

        <label className="inline-flex items-center">
          <span className="sr-only">Loaf count</span>
          <input
            {...input.getInputProps()}
            className="w-16 bg-transparent text-center font-headline italic text-5xl md:text-6xl text-on-surface tabular-nums focus:outline-none"
          />
        </label>

        <button
          type="button"
          aria-label="Increase loaf count"
          onClick={increment}
          className="w-12 h-12 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span aria-hidden="true" className="material-symbols-outlined !text-[22px] leading-none">
            add
          </span>
        </button>
      </div>
      <span className="font-label text-[0.68rem] uppercase tracking-widest text-on-surface-variant">
        {loaves === 1 ? 'loaf' : 'loaves'}
      </span>
      <ClampNote result={clampNote} />
    </div>
  )
}

function BouleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="10" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M 11 13 L 18 20 M 14 11 L 21 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function BatardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <ellipse cx="16" cy="16" rx="12" ry="6" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M 8 14 L 11 18 M 13 14 L 16 18 M 18 14 L 21 18 M 23 14 L 26 18"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MicheIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="12.5" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M 7 12 L 25 20 M 7 16 L 25 16 M 7 20 L 25 12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SourdoughIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M 8 20 C 8 14 12 10 16 10 C 20 10 24 14 24 20 C 24 22 22 23 16 23 C 10 23 8 22 8 20 Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M 13 12 Q 14 8 16 8 Q 18 8 19 12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M 11 16 L 13 18 M 15 15 L 17 18 M 19 16 L 21 19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function FreshYeastIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <rect x="8" y="10" width="16" height="14" rx="2" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.4" />
      <path d="M 12 14 L 20 14 M 12 18 L 20 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 16 10 L 16 24" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2" />
    </svg>
  )
}

function DryYeastIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M 10 12 L 22 12 L 20 22 L 12 22 Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="14" cy="15" r="0.8" fill="currentColor" />
      <circle cx="18" cy="16" r="0.8" fill="currentColor" />
      <circle cx="15" cy="18" r="0.8" fill="currentColor" />
      <circle cx="19" cy="19" r="0.8" fill="currentColor" />
      <circle cx="14" cy="20" r="0.8" fill="currentColor" />
    </svg>
  )
}
