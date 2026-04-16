import { useEffect, useMemo, useState, type ReactElement } from 'react'
import { useRecipeCalculator } from '../../../application/use-cases/useRecipeCalculator'
import { useFermentationZone } from '../../../application/use-cases/useFermentationZone'
import { useStarterRecommendation } from '../../../application/use-cases/useStarterRecommendation'
import { useBakeTime } from '../../../application/use-cases/useBakeTime'
import { useTimeline } from '../../../application/use-cases/useTimeline'
import { useBakingSchedule } from '../../../application/use-cases/useBakingSchedule'
import { Ledger, type LedgerRow } from '../../../design-system/molecules/Ledger'
import { ArcPreview, type ArcStep } from '../../../design-system/molecules/ArcPreview'
import { useSegmented } from '../../../design-system/headless/useSegmented'
import { useNumberInput } from '../../../design-system/headless/useNumberInput'
import { FinishedWeightField } from './fields/FinishedWeightField'
import { LoafCountField } from './fields/LoafCountField'
import { BakeTimeField } from './fields/BakeTimeField'
import { AdvancedSettingsDialog } from './AdvancedSettingsDialog'
import { formatPercentage, formatScheduleTime } from './format'
import { HYDRATION_PRESETS, type HydrationPresetName } from '../../../domain/Hydration'

type WeightPresetValue = 'S' | 'M' | 'L'

function BouleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r="4.5"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M 7.8 8.6 L 11.4 12.2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BatardIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <ellipse
        cx="10"
        cy="10"
        rx="7.5"
        ry="3.5"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M 6 9 L 7.5 11 M 9 9 L 10.5 11 M 12 9 L 13.5 11"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MicheIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r="7.5"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M 5.5 8 L 14.5 12 M 5.5 12 L 14.5 8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

const WEIGHT_PRESETS: readonly {
  value: WeightPresetValue
  label: string
  grams: number
  Icon: (props: { className?: string }) => ReactElement
}[] = [
  { value: 'S', label: 'S', grams: 500, Icon: BouleIcon },
  { value: 'M', label: 'M', grams: 900, Icon: BatardIcon },
  { value: 'L', label: 'L', grams: 1200, Icon: MicheIcon },
]

type HydrationOptionValue = HydrationPresetName | 'Custom'

type FermentChoice = 'sourdough' | 'fresh-yeast' | 'dry-yeast'

function deriveFermentChoice(
  leavingType: 'sourdough' | 'yeast',
  yeastType: 'instant' | 'fresh',
): FermentChoice {
  if (leavingType === 'sourdough') return 'sourdough'
  return yeastType === 'fresh' ? 'fresh-yeast' : 'dry-yeast'
}

export interface EditorialPlanningViewProps {
  settingsOpen: boolean
  onCloseSettings: () => void
}

export function EditorialPlanningView({
  settingsOpen,
  onCloseSettings,
}: EditorialPlanningViewProps) {
  const {
    recipe,
    hydration,
    loaves,
    salt,
    bakeOffLoss,
    yeastType,
    leavingType,
    starterPercent,
    starterHydration,
    doughTemperature,
    hydrationSelection,
    clampNotes,
    changeFinishedWeight,
    changeLoafCount,
    changeSalt,
    changeBakeOffLoss,
    selectYeastType,
    selectHydrationPreset,
    enterCustomHydration,
    unlockCustomHydration,
    selectLeavening,
    changeStarterPercent,
    changeStarterHydration,
    changeDoughTemperature,
  } = useRecipeCalculator('sourdough')

  const fermentation = useFermentationZone(doughTemperature, hydration)
  const { changeFermentationDuration } = fermentation
  const bakeTime = useBakeTime(fermentation.duration)
  const timeline = useTimeline()

  const autoRecommendActive = leavingType === 'sourdough'
  const effectiveBakeTime = autoRecommendActive ? timeline.bakeTime : bakeTime.bakeTime
  const effectiveDuration = autoRecommendActive ? timeline.duration : fermentation.duration

  useEffect(() => {
    if (autoRecommendActive) {
      changeFermentationDuration(timeline.duration)
    }
  }, [autoRecommendActive, timeline.duration, changeFermentationDuration])

  const recommendation = useStarterRecommendation(
    doughTemperature,
    hydration,
    effectiveDuration,
  )

  useEffect(() => {
    if (autoRecommendActive) {
      changeStarterPercent(recommendation.effectivePercent)
    }
  }, [autoRecommendActive, recommendation.effectivePercent, changeStarterPercent])

  const schedule = useBakingSchedule(
    effectiveBakeTime,
    leavingType,
    leavingType === 'sourdough' ? recommendation.effectiveStrategy : null,
  )

  const selectedWeightPreset: WeightPresetValue | null =
    WEIGHT_PRESETS.find((p) => p.grams === recipe.finishedWeightPerLoaf)?.value ?? null

  const selectedHydration: HydrationOptionValue =
    hydrationSelection.mode === 'preset' ? hydrationSelection.preset : 'Custom'

  const handleStarterPercentChange = (fraction: number) => {
    if (autoRecommendActive) {
      recommendation.overrideStarterPercent(fraction)
    } else {
      changeStarterPercent(fraction)
    }
  }

  const fermentChoice = deriveFermentChoice(leavingType, yeastType)
  const selectFerment = (choice: FermentChoice) => {
    if (choice === 'sourdough') {
      selectLeavening('sourdough')
      return
    }
    selectLeavening('yeast')
    selectYeastType(choice === 'fresh-yeast' ? 'fresh' : 'instant')
  }

  const ledgerRows: LedgerRow[] = recipe.ingredients.map((ing) => ({
    name: ing.name,
    grams: ing.grams,
    total: loaves > 1 ? ing.grams * loaves : undefined,
    percentage: formatPercentage(ing.percentage),
  }))

  // eslint-disable-next-line react-hooks/purity -- capture `now` once on mount
  const nowMs = useMemo(() => Date.now(), [])
  const arcSteps: ArcStep[] = schedule.map((ev, idx) => ({
    id: `${ev.name}-${idx}`,
    label: ev.name,
    time: formatScheduleTime(ev.time),
    isPast: ev.time.getTime() < nowMs,
  }))

  const showSourdoughAdvanced = leavingType === 'sourdough'

  return (
    <section
      aria-label="Recipe calculator"
      className="bg-background text-on-surface font-body"
    >
      <div className="space-y-4">
        <RecipeControlsStrip
          selectedPreset={selectedWeightPreset}
          weight={recipe.finishedWeightPerLoaf}
          weightClampNote={clampNotes.finishedWeight}
          onSelectPreset={(v) =>
            changeFinishedWeight(WEIGHT_PRESETS.find((p) => p.value === v)!.grams)
          }
          onChangeWeight={changeFinishedWeight}
          loaves={loaves}
          loavesClampNote={clampNotes.loaves}
          onChangeLoaves={changeLoafCount}
          fermentChoice={fermentChoice}
          onSelectFerment={selectFerment}
          selectedHydration={selectedHydration}
          hydrationPercent={hydration}
          onSelectHydrationPreset={selectHydrationPreset}
          onUnlockCustomHydration={unlockCustomHydration}
          onEnterCustomHydration={enterCustomHydration}
        />

        <div className="grid gap-4 items-stretch grid-cols-1 md:[grid-template-columns:minmax(0,1fr)_minmax(22rem,28rem)]">
          <div className="min-w-0 flex flex-col">
            {showSourdoughAdvanced && (
              <FermentationTimeline
                mixHandleProps={timeline.getMixHandleProps()}
                bakeHandleProps={timeline.getBakeHandleProps()}
                mixTimeLabel={formatScheduleTime(timeline.mixTime)}
                bakeTimeLabel={formatScheduleTime(timeline.bakeTime)}
                duration={timeline.duration}
                zone={fermentation.zone}
                warning={fermentation.warning}
                boundaries={fermentation.boundaries}
                roomTemperature={doughTemperature}
                onChangeRoomTemperature={changeDoughTemperature}
              />
            )}

            {leavingType === 'yeast' && (
              <BakeTimeField
                bakeTime={bakeTime.bakeTime}
                onChange={bakeTime.changeBakeTime}
              />
            )}
          </div>

          <aside className="min-w-0">
            <Ledger
              rows={ledgerRows}
              multiLoaf={loaves > 1}
              totalDoughWeight={recipe.totalDoughWeight}
              finishedLoafWeight={recipe.finishedWeightPerLoaf}
              hydrationPercent={hydration}
            />
          </aside>
        </div>

        {arcSteps.length > 0 && <ArcPreview steps={arcSteps} />}
      </div>

      <AdvancedSettingsDialog
        isOpen={settingsOpen}
        onClose={onCloseSettings}
        salt={salt}
        saltClampNote={clampNotes.salt}
        onChangeSalt={changeSalt}
        bakeOffLoss={bakeOffLoss}
        bakeOffLossClampNote={clampNotes.bakeOffLoss}
        onChangeBakeOffLoss={changeBakeOffLoss}
        showSourdoughFields={showSourdoughAdvanced}
        leavingType={leavingType}
        starterHydration={starterHydration}
        starterHydrationClampNote={clampNotes.starterHydration}
        onChangeStarterHydration={changeStarterHydration}
        starterPercent={starterPercent}
        starterPercentClampNote={clampNotes.starterPercent}
        onChangeStarterPercent={handleStarterPercentChange}
      />
    </section>
  )
}

function RecipeControlsStrip({
  selectedPreset,
  weight,
  weightClampNote,
  onSelectPreset,
  onChangeWeight,
  loaves,
  loavesClampNote,
  onChangeLoaves,
  fermentChoice,
  onSelectFerment,
  selectedHydration,
  hydrationPercent,
  onSelectHydrationPreset,
  onUnlockCustomHydration,
  onEnterCustomHydration,
}: {
  selectedPreset: WeightPresetValue | null
  weight: number
  weightClampNote: import('../../../domain/InputRanges').ClampResult
  onSelectPreset: (value: WeightPresetValue) => void
  onChangeWeight: (grams: number) => void
  loaves: number
  loavesClampNote: import('../../../domain/InputRanges').ClampResult
  onChangeLoaves: (count: number) => void
  fermentChoice: FermentChoice
  onSelectFerment: (choice: FermentChoice) => void
  selectedHydration: HydrationOptionValue
  hydrationPercent: number
  onSelectHydrationPreset: (preset: HydrationPresetName) => void
  onUnlockCustomHydration: () => void
  onEnterCustomHydration: (fraction: number) => void
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-3 sm:p-4 space-y-4">
      <div className="flex flex-wrap md:flex-nowrap items-start md:items-stretch md:justify-between gap-x-6 md:gap-x-8 gap-y-4">
        <SizeControl
          selectedPreset={selectedPreset}
          weight={weight}
          onSelectPreset={onSelectPreset}
          onChangeWeight={onChangeWeight}
          clampNote={weightClampNote}
        />
        <StripDivider />
        <LoavesControl
          loaves={loaves}
          onChange={onChangeLoaves}
          clampNote={loavesClampNote}
        />
        <StripDivider />
        <FermentControl
          fermentChoice={fermentChoice}
          onSelectFerment={onSelectFerment}
        />
      </div>
      <div className="pt-3 border-t border-outline-variant/15">
        <HydrationControl
          selectedOption={selectedHydration}
          customPercent={hydrationPercent}
          onSelectPreset={onSelectHydrationPreset}
          onUnlockCustom={onUnlockCustomHydration}
          onEnterCustom={onEnterCustomHydration}
        />
      </div>
    </div>
  )
}

function StripDivider() {
  return (
    <div
      aria-hidden="true"
      className="hidden md:block self-stretch w-px bg-outline-variant/15"
    />
  )
}

function FieldKicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-label text-[0.65rem] uppercase tracking-widest text-on-surface-variant block mb-2">
      {children}
    </span>
  )
}

function ChipButton({
  isSelected,
  stretch,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isSelected: boolean
  stretch?: boolean
  ref?: (node: HTMLElement | null) => void
}) {
  return (
    <button
      {...rest}
      className={[
        'px-3 py-1.5 rounded-full text-xs font-label transition-all',
        stretch ? 'flex-1' : 'whitespace-nowrap',
        isSelected
          ? 'bg-primary text-on-primary shadow-sm'
          : 'bg-transparent text-on-surface-variant hover:text-on-surface',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

const PILL_GROUP_CLASS =
  'flex gap-0.5 bg-surface-container-low rounded-full p-1'

type SizeOptionValue = WeightPresetValue | 'Custom'

function SizeControl({
  selectedPreset,
  weight,
  onSelectPreset,
  onChangeWeight,
  clampNote,
}: {
  selectedPreset: WeightPresetValue | null
  weight: number
  onSelectPreset: (value: WeightPresetValue) => void
  onChangeWeight: (grams: number) => void
  clampNote: import('../../../domain/InputRanges').ClampResult
}) {
  const [customMode, setCustomMode] = useState(selectedPreset === null)

  const effectiveSelection: SizeOptionValue =
    customMode || selectedPreset === null ? 'Custom' : selectedPreset

  const options: { value: SizeOptionValue; label: string }[] = [
    ...WEIGHT_PRESETS.map((p) => ({ value: p.value, label: p.label })),
    { value: 'Custom', label: 'Custom' },
  ]

  const segmented = useSegmented<SizeOptionValue>({
    options,
    value: effectiveSelection,
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
    <div className="flex flex-col">
      <FieldKicker>Size</FieldKicker>
      <div {...segmented.getRootProps()} className={PILL_GROUP_CLASS}>
        {options.map((option) => {
          const props = segmented.getOptionProps(option.value)
          const preset = WEIGHT_PRESETS.find((p) => p.value === option.value)
          return (
            <ChipButton
              key={option.value}
              {...props}
              aria-label={option.label}
              isSelected={effectiveSelection === option.value}
            >
              {preset ? <preset.Icon className="w-5 h-5" /> : option.label}
            </ChipButton>
          )
        })}
      </div>
      {customMode && (
        <div className="mt-3">
          <FinishedWeightField
            weight={weight}
            onChange={onChangeWeight}
            clampNote={clampNote}
            resetKey="custom"
          />
        </div>
      )}
    </div>
  )
}

function LoavesControl({
  loaves,
  onChange,
  clampNote,
}: {
  loaves: number
  onChange: (count: number) => void
  clampNote: import('../../../domain/InputRanges').ClampResult
}) {
  return (
    <div className="flex flex-col items-start md:items-center text-left md:text-center">
      <FieldKicker>Loaves</FieldKicker>
      <LoafCountField
        loaves={loaves}
        onChange={onChange}
        clampNote={clampNote}
      />
    </div>
  )
}

function FermentControl({
  fermentChoice,
  onSelectFerment,
}: {
  fermentChoice: FermentChoice
  onSelectFerment: (choice: FermentChoice) => void
}) {
  const options: { value: FermentChoice; label: string }[] = [
    { value: 'sourdough', label: 'Sourdough' },
    { value: 'fresh-yeast', label: 'Fresh yeast' },
    { value: 'dry-yeast', label: 'Dry yeast' },
  ]
  const segmented = useSegmented<FermentChoice>({
    options,
    value: fermentChoice,
    onChange: onSelectFerment,
    label: 'Fermentation path',
  })

  return (
    <div className="flex flex-col items-start md:items-end text-left md:text-right">
      <FieldKicker>Ferment</FieldKicker>
      <div {...segmented.getRootProps()} className={PILL_GROUP_CLASS}>
        {options.map((option) => {
          const props = segmented.getOptionProps(option.value)
          return (
            <ChipButton
              key={option.value}
              {...props}
              aria-label={option.label}
              isSelected={fermentChoice === option.value}
            >
              {option.label}
            </ChipButton>
          )
        })}
      </div>
    </div>
  )
}

function HydrationControl({
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
  const options: { value: HydrationOptionValue; label: string }[] = [
    ...HYDRATION_PRESETS.map((p) => ({
      value: p.name,
      label: `${p.name} — ${Math.round(p.percentage * 100)}%`,
    })),
    { value: 'Custom', label: 'Custom' },
  ]

  const segmented = useSegmented<HydrationOptionValue>({
    options,
    value: selectedOption,
    onChange: (value) => {
      if (value === 'Custom') onUnlockCustom()
      else onSelectPreset(value)
    },
    label: 'Hydration',
  })

  return (
    <div className="flex flex-col">
      <FieldKicker>Hydration</FieldKicker>
      <div {...segmented.getRootProps()} className={PILL_GROUP_CLASS}>
        {options.map((option) => {
          const props = segmented.getOptionProps(option.value)
          const isSelected = selectedOption === option.value
          return (
            <ChipButton
              key={option.value}
              {...props}
              aria-label={option.label}
              isSelected={isSelected}
              stretch
            >
              {option.label}
            </ChipButton>
          )
        })}
      </div>
      {selectedOption === 'Custom' && (
        <div className="mt-2">
          <CustomHydrationInput
            percentage={customPercent}
            onChange={onEnterCustom}
          />
        </div>
      )}
    </div>
  )
}

type TimelineHandleProps = ReturnType<ReturnType<typeof useTimeline>['getMixHandleProps']>

function TimelineHandle({
  handleProps,
  ariaLabel,
  headline,
  caption,
  timeLabel,
  sliderClass,
}: {
  handleProps: TimelineHandleProps
  ariaLabel: string
  headline: string
  caption: string
  timeLabel: string
  sliderClass: string
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between mb-1">
        <span className="font-label text-[0.8rem] text-on-surface">{headline}</span>
        <span className="font-headline italic text-lg text-on-surface">{timeLabel}</span>
      </span>
      <span className="block text-xs text-on-surface-variant font-body mb-2">
        {caption}
      </span>
      <input {...handleProps} aria-label={ariaLabel} className={sliderClass} />
    </label>
  )
}

const TIMELINE_SPAN = 48

const ZONE_LABELS: Record<'green' | 'yellow' | 'red', string> = {
  green: 'Ideal window',
  yellow: 'Cautionary',
  red: 'Out of range',
}

function formatHours(hours: number): string {
  return `${Math.round(hours * 10) / 10}h`
}

function FermentationTimeline({
  mixHandleProps,
  bakeHandleProps,
  mixTimeLabel,
  bakeTimeLabel,
  duration,
  zone,
  warning,
  boundaries,
  roomTemperature,
  onChangeRoomTemperature,
}: {
  mixHandleProps: TimelineHandleProps
  bakeHandleProps: TimelineHandleProps
  mixTimeLabel: string
  bakeTimeLabel: string
  duration: number
  zone: 'green' | 'yellow' | 'red'
  warning: string | null
  boundaries: import('../../../domain/Fermentation').FermentationBoundaries
  roomTemperature: number
  onChangeRoomTemperature: (tempC: number) => void
}) {
  const { greenLow, greenHigh, yellowLow, yellowHigh } = boundaries
  const pct = (hours: number) =>
    `${Math.max(0, Math.min(100, (hours / TIMELINE_SPAN) * 100))}%`
  const durationPct = pct(Math.max(0, Math.min(TIMELINE_SPAN, duration)))

  const sliderClass =
    'w-full accent-primary cursor-pointer h-1 bg-surface-container rounded-full'

  return (
    <div className="h-full space-y-3 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div>
          <span className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant block mb-1">
            Fermentation Timeline
          </span>
          <p className="text-xs font-body text-on-surface-variant italic">
            Drag to schedule when to start the dough and when to bake.
          </p>
        </div>
        <RoomTemperatureControl
          tempC={roomTemperature}
          onChange={onChangeRoomTemperature}
        />
      </div>

      <TimelineHandle
        handleProps={mixHandleProps}
        ariaLabel="Mix handle"
        headline="Start mixing"
        caption="Dough comes together — fermentation begins."
        timeLabel={mixTimeLabel}
        sliderClass={sliderClass}
      />

      <TimelineHandle
        handleProps={bakeHandleProps}
        ariaLabel="Bake handle"
        headline="Into the oven"
        caption="End of ferment — loaf goes to bake."
        timeLabel={bakeTimeLabel}
        sliderClass={sliderClass}
      />

      <div>
        <div
          role="presentation"
          aria-label="Fermentation zones"
          className="relative h-3 rounded-full overflow-hidden bg-surface-container-low border border-outline-variant/30"
        >
          <div
            role="img"
            aria-label={`Red zone – unsafe below ${yellowLow}h or above ${yellowHigh}h`}
            className="absolute inset-0 bg-error-container/20"
          />
          <div
            role="img"
            aria-label={`Yellow zone – cautionary ${yellowLow}h to ${greenLow}h and ${greenHigh}h to ${yellowHigh}h`}
            className="absolute inset-y-0 bg-tertiary-fixed/70"
            style={{ left: pct(yellowLow), right: pct(TIMELINE_SPAN - yellowHigh) }}
          />
          <div
            role="img"
            aria-label={`Green zone – ideal ${greenLow}h to ${greenHigh}h`}
            className="absolute inset-y-0 bg-[#c2d4ae]/60"
            style={{ left: pct(greenLow), right: pct(TIMELINE_SPAN - greenHigh) }}
          />
          <div
            aria-hidden="true"
            className="absolute top-[-4px] bottom-[-4px] w-[2px] bg-on-surface rounded-full"
            style={{ left: durationPct, transform: 'translateX(-1px)' }}
          />
        </div>
        <div
          aria-hidden="true"
          className="flex justify-between mt-1 font-label text-[0.65rem] uppercase tracking-widest text-on-surface-variant"
        >
          <span>0h</span>
          <span>{TIMELINE_SPAN}h</span>
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-headline text-2xl italic text-on-surface">
          {formatHours(duration)}
        </span>
        <span
          role="status"
          className="font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant"
        >
          {ZONE_LABELS[zone]} · {zone}
        </span>
      </div>
      {warning && (
        <p className="text-xs text-error font-body">{warning}</p>
      )}
    </div>
  )
}

function CustomHydrationInput({
  percentage,
  onChange,
}: {
  percentage: number
  onChange: (fraction: number) => void
}) {
  const input = useNumberInput({
    value: Math.round(percentage * 100),
    onChange: (n) => onChange(n / 100),
  })
  return (
    <label className="font-label text-xs text-on-surface-variant">
      Custom hydration (%) <input {...input.getInputProps()} className="ml-2 px-2 py-1 border border-outline-variant rounded" />
    </label>
  )
}

function RoomTemperatureControl({
  tempC,
  onChange,
}: {
  tempC: number
  onChange: (tempC: number) => void
}) {
  const input = useNumberInput({ value: tempC, onChange })
  return (
    <label className="flex items-center gap-2 shrink-0">
      <span className="font-label text-[0.65rem] uppercase tracking-widest text-on-surface-variant">
        Room temperature
      </span>
      <span className="inline-flex items-baseline gap-1 px-2.5 py-1 rounded-full bg-surface-container-low">
        <input
          {...input.getInputProps()}
          aria-label="Room temperature"
          className="w-10 bg-transparent text-right font-headline italic text-base text-on-surface tabular-nums focus:outline-none"
        />
        <span aria-hidden="true" className="font-label text-xs text-on-surface-variant">
          °C
        </span>
      </span>
    </label>
  )
}
