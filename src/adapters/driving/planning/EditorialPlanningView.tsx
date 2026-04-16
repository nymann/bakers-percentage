import { useEffect, useMemo } from 'react'
import { useRecipeCalculator } from '../../../application/use-cases/useRecipeCalculator'
import { useFermentationZone } from '../../../application/use-cases/useFermentationZone'
import { useStarterRecommendation } from '../../../application/use-cases/useStarterRecommendation'
import { useBakeTime } from '../../../application/use-cases/useBakeTime'
import { useTimeline } from '../../../application/use-cases/useTimeline'
import { useBakingSchedule } from '../../../application/use-cases/useBakingSchedule'
import { Disclosure } from '../../../design-system/atoms/Disclosure'
import { Ledger, type LedgerRow } from '../../../design-system/molecules/Ledger'
import { ArcPreview, type ArcStep } from '../../../design-system/molecules/ArcPreview'
import { useSegmented } from '../../../design-system/headless/useSegmented'
import { useNumberInput } from '../../../design-system/headless/useNumberInput'
import { FinishedWeightField } from './fields/FinishedWeightField'
import { LoafCountField } from './fields/LoafCountField'
import { SaltField } from './fields/SaltField'
import { BakeOffLossField } from './fields/BakeOffLossField'
import { StarterHydrationField } from './fields/StarterHydrationField'
import { DoughTemperatureField } from './fields/DoughTemperatureField'
import { StarterPercentField } from './fields/StarterPercentField'
import { BakeTimeField } from './fields/BakeTimeField'
import { formatPercentage, formatScheduleTime } from './format'
import { HYDRATION_PRESETS, type HydrationPresetName } from '../../../domain/Hydration'

type WeightPresetValue = 'S' | 'M' | 'L'

const WEIGHT_PRESETS: readonly {
  value: WeightPresetValue
  label: string
  grams: number
  subtitle: string
}[] = [
  { value: 'S', label: 'S', grams: 500, subtitle: '500g Boule' },
  { value: 'M', label: 'M', grams: 900, subtitle: '900g Batard' },
  { value: 'L', label: 'L', grams: 1200, subtitle: '1.2kg Miche' },
]

type HydrationOptionValue = HydrationPresetName | 'Custom'

export function EditorialPlanningView() {
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
      <div style={PLANNING_GRID_STYLE} className="gap-6 items-start">
        <div style={{ gridArea: 'strip' }} className="min-w-0">
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
            leavingType={leavingType}
            onSelectLeavening={selectLeavening}
            yeastType={yeastType}
            onSelectYeastType={selectYeastType}
            selectedHydration={selectedHydration}
            hydrationPercent={hydration}
            onSelectHydrationPreset={selectHydrationPreset}
            onUnlockCustomHydration={unlockCustomHydration}
            onEnterCustomHydration={enterCustomHydration}
          />
        </div>

        <div style={{ gridArea: 'timeline' }} className="min-w-0">
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
            />
          )}

          {leavingType === 'yeast' && (
            <BakeTimeField
              bakeTime={bakeTime.bakeTime}
              onChange={bakeTime.changeBakeTime}
            />
          )}
        </div>

        <div style={{ gridArea: 'advanced' }} className="min-w-0">
          <Disclosure label="Advanced">
            <SaltField
              saltPercent={salt}
              onChange={changeSalt}
              clampNote={clampNotes.salt}
            />
            <BakeOffLossField
              bakeOffLoss={bakeOffLoss}
              onChange={changeBakeOffLoss}
              clampNote={clampNotes.bakeOffLoss}
            />
            {showSourdoughAdvanced && (
              <>
                <StarterHydrationField
                  starterHydration={starterHydration}
                  onChange={changeStarterHydration}
                  clampNote={clampNotes.starterHydration}
                  resetKey={leavingType}
                />
                <DoughTemperatureField
                  doughTemperature={doughTemperature}
                  onChange={changeDoughTemperature}
                  clampNote={clampNotes.doughTemperature}
                  resetKey={leavingType}
                />
                <StarterPercentField
                  percent={starterPercent}
                  onChange={handleStarterPercentChange}
                  clampNote={clampNotes.starterPercent}
                  resetKey={leavingType}
                />
              </>
            )}
          </Disclosure>
        </div>

        <aside
          style={{ gridArea: 'formula' }}
          className="space-y-6 lg:sticky lg:top-4 min-w-0"
        >
          <Ledger
            rows={ledgerRows}
            multiLoaf={loaves > 1}
            totalDoughWeight={recipe.totalDoughWeight}
            finishedLoafWeight={recipe.finishedWeightPerLoaf}
            hydrationPercent={hydration}
          />
          {arcSteps.length > 0 && <ArcPreview steps={arcSteps} />}
        </aside>
      </div>
    </section>
  )
}

const PLANNING_GRID_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(18rem, 22rem)',
  gridTemplateAreas: `
    "strip    formula"
    "timeline formula"
    "advanced formula"
  `,
} as const

function RecipeControlsStrip({
  selectedPreset,
  weight,
  weightClampNote,
  onSelectPreset,
  onChangeWeight,
  loaves,
  loavesClampNote,
  onChangeLoaves,
  leavingType,
  onSelectLeavening,
  yeastType,
  onSelectYeastType,
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
  leavingType: 'sourdough' | 'yeast'
  onSelectLeavening: (type: 'sourdough' | 'yeast') => void
  yeastType: 'instant' | 'fresh'
  onSelectYeastType: (type: 'instant' | 'fresh') => void
  selectedHydration: HydrationOptionValue
  hydrationPercent: number
  onSelectHydrationPreset: (preset: HydrationPresetName) => void
  onUnlockCustomHydration: () => void
  onEnterCustomHydration: (fraction: number) => void
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-4 md:p-5">
      <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
        <SizeControl
          selectedPreset={selectedPreset}
          weight={weight}
          onSelectPreset={onSelectPreset}
          onChangeWeight={onChangeWeight}
          clampNote={weightClampNote}
        />
        <LoavesControl
          loaves={loaves}
          onChange={onChangeLoaves}
          clampNote={loavesClampNote}
        />
        <FermentControl
          leavingType={leavingType}
          onSelectLeavening={onSelectLeavening}
        />
        {leavingType === 'yeast' && (
          <YeastTypeControl
            yeastType={yeastType}
            onSelectYeastType={onSelectYeastType}
          />
        )}
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

function FieldKicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-label text-[0.65rem] uppercase tracking-widest text-on-surface-variant block mb-2">
      {children}
    </span>
  )
}

function ChipButton({
  isSelected,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isSelected: boolean
  ref?: (node: HTMLElement | null) => void
}) {
  return (
    <button
      {...rest}
      className={[
        'px-3 py-1.5 rounded-full text-xs font-label transition-all',
        isSelected
          ? 'bg-primary text-on-primary'
          : 'bg-surface-container-low text-on-surface hover:bg-surface-container',
      ].join(' ')}
    />
  )
}

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
  const options = WEIGHT_PRESETS.map((p) => ({ value: p.value, label: p.label }))
  const segmented = useSegmented<WeightPresetValue>({
    options,
    value: selectedPreset,
    onChange: onSelectPreset,
    label: 'Finished weight',
  })
  const selectedSubtitle = WEIGHT_PRESETS.find(
    (p) => p.value === selectedPreset,
  )?.subtitle

  return (
    <div className="flex flex-col min-w-[16rem]">
      <FieldKicker>Size</FieldKicker>
      <div className="flex items-center gap-2 flex-wrap">
        <div {...segmented.getRootProps()} className="flex gap-1">
          {options.map((option) => {
            const props = segmented.getOptionProps(option.value)
            return (
              <ChipButton
                key={option.value}
                {...props}
                aria-label={option.label}
                isSelected={selectedPreset === option.value}
              >
                {option.label}
              </ChipButton>
            )
          })}
        </div>
        <div className="flex items-baseline gap-1">
          <FinishedWeightField
            weight={weight}
            onChange={onChangeWeight}
            clampNote={clampNote}
            resetKey={selectedPreset ?? 'custom'}
          />
        </div>
      </div>
      {selectedSubtitle && (
        <span className="font-label text-[0.6rem] uppercase tracking-widest text-on-surface-variant mt-1">
          {selectedSubtitle}
        </span>
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
    <div className="flex flex-col">
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
  leavingType,
  onSelectLeavening,
}: {
  leavingType: 'sourdough' | 'yeast'
  onSelectLeavening: (type: 'sourdough' | 'yeast') => void
}) {
  const options: { value: 'sourdough' | 'yeast'; label: string }[] = [
    { value: 'sourdough', label: 'Sourdough' },
    { value: 'yeast', label: 'Yeast' },
  ]
  const segmented = useSegmented({
    options,
    value: leavingType,
    onChange: onSelectLeavening,
    label: 'Fermentation path',
  })

  return (
    <div className="flex flex-col">
      <FieldKicker>Ferment</FieldKicker>
      <div {...segmented.getRootProps()} className="flex gap-1">
        {options.map((option) => {
          const props = segmented.getOptionProps(option.value)
          return (
            <ChipButton
              key={option.value}
              {...props}
              aria-label={option.label}
              isSelected={leavingType === option.value}
            >
              {option.label}
            </ChipButton>
          )
        })}
      </div>
    </div>
  )
}

function YeastTypeControl({
  yeastType,
  onSelectYeastType,
}: {
  yeastType: 'instant' | 'fresh'
  onSelectYeastType: (type: 'instant' | 'fresh') => void
}) {
  const options: { value: 'instant' | 'fresh'; label: string }[] = [
    { value: 'instant', label: 'Instant — 1%' },
    { value: 'fresh', label: 'Fresh — 3%' },
  ]
  const segmented = useSegmented({
    options,
    value: yeastType,
    onChange: onSelectYeastType,
    label: 'Yeast type',
  })

  return (
    <div className="flex flex-col">
      <FieldKicker>Yeast type</FieldKicker>
      <div {...segmented.getRootProps()} className="flex gap-1">
        {options.map((option) => {
          const props = segmented.getOptionProps(option.value)
          return (
            <ChipButton
              key={option.value}
              {...props}
              aria-label={option.label}
              isSelected={yeastType === option.value}
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
      <div {...segmented.getRootProps()} className="flex gap-1 flex-wrap">
        {options.map((option) => {
          const props = segmented.getOptionProps(option.value)
          const isSelected = selectedOption === option.value
          return (
            <ChipButton
              key={option.value}
              {...props}
              aria-label={option.label}
              isSelected={isSelected}
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
}: {
  mixHandleProps: TimelineHandleProps
  bakeHandleProps: TimelineHandleProps
  mixTimeLabel: string
  bakeTimeLabel: string
  duration: number
  zone: 'green' | 'yellow' | 'red'
  warning: string | null
  boundaries: import('../../../domain/Fermentation').FermentationBoundaries
}) {
  const { greenLow, greenHigh, yellowLow, yellowHigh } = boundaries
  const pct = (hours: number) =>
    `${Math.max(0, Math.min(100, (hours / TIMELINE_SPAN) * 100))}%`
  const durationPct = pct(Math.max(0, Math.min(TIMELINE_SPAN, duration)))

  const sliderClass =
    'w-full accent-primary cursor-pointer h-1 bg-surface-container rounded-full'

  return (
    <div className="space-y-4 p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
      <div>
        <span className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant block mb-1">
          Fermentation Timeline
        </span>
        <p className="text-xs font-body text-on-surface-variant italic">
          Drag to schedule when to start the dough and when to bake.
        </p>
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
