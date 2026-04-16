import { useEffect, useMemo } from 'react'
import { useRecipeCalculator } from '../../../application/use-cases/useRecipeCalculator'
import { useFermentationZone } from '../../../application/use-cases/useFermentationZone'
import { useStarterRecommendation } from '../../../application/use-cases/useStarterRecommendation'
import { useBakeTime } from '../../../application/use-cases/useBakeTime'
import { useBakingSchedule } from '../../../application/use-cases/useBakingSchedule'
import { useFeatureFlag } from '../../../use-feature-flag'
import { SegmentedSelector } from '../../../design-system/atoms/SegmentedSelector'
import { ToggleCard } from '../../../design-system/atoms/ToggleCard'
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
  const yeastEnabled = useFeatureFlag('yeast-recipe-calculator')
  if (!yeastEnabled) return null
  return <EditorialPlanningLayout />
}

function EditorialPlanningLayout() {
  const hydrationPresetEnabled = useFeatureFlag('hydration-preset')
  const validationEnabled = useFeatureFlag('validate-basic-inputs')
  const fermentationZoneEnabled = useFeatureFlag('fermentation-zone-feedback')
  const autoRecommendEnabled = useFeatureFlag('auto-recommend-starter-percent')
  const bakingScheduleEnabled = useFeatureFlag('baking-schedule')

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

  const autoRecommendActive = autoRecommendEnabled && leavingType === 'sourdough'
  const effectiveDuration = autoRecommendActive ? bakeTime.duration : fermentation.duration

  useEffect(() => {
    if (autoRecommendActive) {
      changeFermentationDuration(bakeTime.duration)
    }
  }, [autoRecommendActive, bakeTime.duration, changeFermentationDuration])

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
    bakeTime.bakeTime,
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
      className="bg-background text-on-surface font-body px-4 md:px-8 py-8"
    >
      <header className="mb-10 max-w-6xl mx-auto">
        <span className="font-label text-primary uppercase tracking-[0.2em] text-[0.7rem] block mb-2">
          Recipe Configuration
        </span>
        <h1 className="font-headline text-4xl md:text-5xl text-on-surface leading-tight mb-2 italic">
          Baker's Percentage Calculator
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        <section className="md:col-span-7 space-y-10">
          <FinishedWeightSection
            selectedPreset={selectedWeightPreset}
            weight={recipe.finishedWeightPerLoaf}
            onSelectPreset={(v) =>
              changeFinishedWeight(WEIGHT_PRESETS.find((p) => p.value === v)!.grams)
            }
            onChangeWeight={changeFinishedWeight}
            clampNote={clampNotes.finishedWeight}
            validationEnabled={validationEnabled}
          />

          <LeaveningSection
            leavingType={leavingType}
            onSelectLeavening={selectLeavening}
          />

          {leavingType === 'yeast' && (
            <YeastTypeSegmented
              yeastType={yeastType}
              onSelectYeastType={selectYeastType}
            />
          )}

          <LoafCountField
            loaves={loaves}
            onChange={changeLoafCount}
            clampNote={clampNotes.loaves}
            validationEnabled={validationEnabled}
          />

          {hydrationPresetEnabled && (
            <HydrationSegmentedField
              selectedOption={selectedHydration}
              customPercent={hydration}
              onSelectPreset={selectHydrationPreset}
              onUnlockCustom={unlockCustomHydration}
              onEnterCustom={enterCustomHydration}
            />
          )}

          {validationEnabled && (
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
                </>
              )}
            </Disclosure>
          )}

          {showSourdoughAdvanced && (
            <StarterPercentField
              percent={starterPercent}
              onChange={handleStarterPercentChange}
              clampNote={clampNotes.starterPercent}
              validationEnabled={validationEnabled}
              resetKey={leavingType}
            />
          )}

          <BakeTimeField
            bakeTime={bakeTime.bakeTime}
            onChange={bakeTime.changeBakeTime}
          />

          {fermentationZoneEnabled && showSourdoughAdvanced && (
            <div role="status" className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
              {fermentation.zone}
            </div>
          )}
        </section>

        <aside className="md:col-span-5 space-y-6 md:sticky md:top-4">
          <Ledger
            rows={ledgerRows}
            multiLoaf={loaves > 1}
            totalDoughWeight={recipe.totalDoughWeight}
            finishedLoafWeight={recipe.finishedWeightPerLoaf}
            hydrationPercent={hydration}
          />
          {bakingScheduleEnabled && arcSteps.length > 0 && (
            <ArcPreview steps={arcSteps} />
          )}
        </aside>
      </div>
    </section>
  )
}

function FinishedWeightSection({
  selectedPreset,
  weight,
  onSelectPreset,
  onChangeWeight,
  clampNote,
  validationEnabled,
}: {
  selectedPreset: WeightPresetValue | null
  weight: number
  onSelectPreset: (value: WeightPresetValue) => void
  onChangeWeight: (grams: number) => void
  clampNote: import('../../../domain/InputRanges').ClampResult
  validationEnabled: boolean
}) {
  return (
    <div>
      <span className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant block mb-4">
        Volume &amp; Scale
      </span>
      <SegmentedSelector
        label="Finished weight"
        options={WEIGHT_PRESETS.map((p) => ({ value: p.value, label: p.label }))}
        value={selectedPreset}
        onChange={onSelectPreset}
        renderOption={(option) => {
          const preset = WEIGHT_PRESETS.find((p) => p.value === option.value)!
          return (
            <>
              <span className="block font-headline text-2xl italic mb-1">
                {preset.label}
              </span>
              <span className="block font-label text-[0.6rem] uppercase tracking-tighter opacity-80">
                {preset.subtitle}
              </span>
            </>
          )
        }}
      />
      <div className="mt-4">
        <FinishedWeightField
          weight={weight}
          onChange={onChangeWeight}
          clampNote={clampNote}
          validationEnabled={validationEnabled}
          resetKey={selectedPreset ?? 'custom'}
        />
      </div>
    </div>
  )
}

function LeaveningSection({
  leavingType,
  onSelectLeavening,
}: {
  leavingType: 'sourdough' | 'yeast'
  onSelectLeavening: (type: 'sourdough' | 'yeast') => void
}) {
  return (
    <div>
      <span className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant block mb-4">
        Fermentation Path
      </span>
      <div className="grid grid-cols-2 gap-4">
        <ToggleCard
          label="Sourdough"
          pressed={leavingType === 'sourdough'}
          onActivate={() => onSelectLeavening('sourdough')}
        >
          <div>
            <h4 className="font-headline text-lg leading-none mb-1">Sourdough</h4>
            <p className="text-[0.7rem] text-on-surface-variant font-body leading-tight">
              Wild yeast, long ferment, deep complexity.
            </p>
          </div>
        </ToggleCard>
        <ToggleCard
          label="Yeast"
          pressed={leavingType === 'yeast'}
          onActivate={() => onSelectLeavening('yeast')}
        >
          <div>
            <h4 className="font-headline text-lg leading-none mb-1">Yeast</h4>
            <p className="text-[0.7rem] text-on-surface-variant font-body leading-tight">
              Commercial yeast, predictable, quick rise.
            </p>
          </div>
        </ToggleCard>
      </div>
    </div>
  )
}

function YeastTypeSegmented({
  yeastType,
  onSelectYeastType,
}: {
  yeastType: 'instant' | 'fresh'
  onSelectYeastType: (type: 'instant' | 'fresh') => void
}) {
  return (
    <div>
      <span className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant block mb-4">
        Yeast Type
      </span>
      <SegmentedSelector
        label="Yeast type"
        options={[
          { value: 'instant', label: 'Instant — 1%' },
          { value: 'fresh', label: 'Fresh — 3%' },
        ]}
        value={yeastType}
        onChange={onSelectYeastType}
      />
    </div>
  )
}

function HydrationSegmentedField({
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
    <div>
      <span className="font-label text-[0.75rem] uppercase tracking-widest text-on-surface-variant block mb-4">
        Hydration
      </span>
      <div {...segmented.getRootProps()} className="flex gap-2 flex-wrap">
        {options.map((option) => {
          const props = segmented.getOptionProps(option.value)
          const isSelected = selectedOption === option.value
          return (
            <button
              key={option.value}
              {...props}
              aria-label={option.label}
              className={[
                'px-4 py-2 rounded-full text-sm transition-all font-label',
                isSelected
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container',
              ].join(' ')}
            >
              {option.label}
            </button>
          )
        })}
      </div>
      {selectedOption === 'Custom' && (
        <div className="mt-4">
          <CustomHydrationInput
            percentage={customPercent}
            onChange={onEnterCustom}
          />
        </div>
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
