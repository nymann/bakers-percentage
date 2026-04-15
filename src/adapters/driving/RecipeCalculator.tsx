import { useEffect, useRef, useState } from 'react'
import { useRecipeCalculator } from '../../application/use-cases/useRecipeCalculator'
import { useFermentationZone } from '../../application/use-cases/useFermentationZone'
import { useStarterRecommendation } from '../../application/use-cases/useStarterRecommendation'
import { useBakeTime } from '../../application/use-cases/useBakeTime'
import { useBakingSchedule } from '../../application/use-cases/useBakingSchedule'
import type { YeastType } from '../../domain/Recipe'
import type { LeavingType } from '../../domain/SourdoughRecipe'
import { FermentationWindow, type FermentationMethod } from '../../domain/StarterRecommendation'
import { HYDRATION_PRESETS } from '../../domain/Hydration'
import type { ClampResult } from '../../domain/InputRanges'
import { useFeatureFlag } from '../../feature-flags'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '../../design-system/atoms/Table'
import { tokens } from '../../design-system/tokens'

function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`
}

function formatDatetimeLocal(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}`
}

function formatScheduleTime(date: Date): string {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m} ${dayNames[date.getDay()]}`
}

function formatRangeValue(value: number, unit: string): string {
  if (unit === '%') return String(Math.round(value * 100))
  return String(value)
}

function ClampNote({ result }: { result: ClampResult }) {
  if (!result.clamped) return null
  const { range } = result
  const min = formatRangeValue(range.min, range.unit)
  const max = formatRangeValue(range.max, range.unit)
  const suffix = range.unit
  return (
    <small style={{ color: tokens.colors.textMuted, marginLeft: tokens.spacing.sm }}>
      Valid range: {min}–{max}{suffix}
    </small>
  )
}

export function RecipeCalculator() {
  const enabled = useFeatureFlag('yeast-recipe-calculator')
  if (!enabled) return null

  return <RecipeCalculatorView />
}

function useNumberInput(value: number, onChange: (n: number) => void, resetKey?: unknown) {
  const [text, setText] = useState(String(value))
  const lastCommitted = useRef(value)
  const prevResetKey = useRef(resetKey)

  if (resetKey !== prevResetKey.current) {
    prevResetKey.current = resetKey
    setText(String(value))
    lastCommitted.current = value
  }

  function handleChange(rawText: string) {
    setText(rawText)
    const n = Number(rawText)
    if (rawText !== '' && !Number.isNaN(n)) {
      lastCommitted.current = n
      onChange(n)
    }
  }

  function handleBlur() {
    if (value !== lastCommitted.current) {
      setText(String(value))
      lastCommitted.current = value
    }
  }

  return { value: text, onChange: handleChange, onBlur: handleBlur }
}

function CustomHydrationInput({
  percentage,
  onChange,
}: {
  percentage: number
  onChange: (n: number) => void
}) {
  const input = useNumberInput(Math.round(percentage * 100), (n) =>
    onChange(n / 100),
  )
  return (
    <label>
      Custom hydration (%){' '}
      <input
        type="number"
        value={input.value}
        onChange={(e) => input.onChange(e.target.value)}
        onBlur={input.onBlur}
      />
    </label>
  )
}

function StarterPercentClampNote({ result }: { result: ClampResult }) {
  if (!result.clamped) return null
  return (
    <small style={{ color: tokens.colors.textMuted, marginLeft: tokens.spacing.sm }}>
      Base flour must remain positive
    </small>
  )
}

function LeaveningSelector({
  leavingType,
  yeastType,
  onSelectLeavening,
  onSelectYeastType,
  starterPercentInput,
  starterPercentClamp,
  validationEnabled,
}: {
  leavingType: LeavingType
  yeastType: YeastType
  onSelectLeavening: (type: LeavingType) => void
  onSelectYeastType: (type: YeastType) => void
  starterPercentInput: { value: string; onChange: (s: string) => void; onBlur: () => void }
  starterPercentClamp: ClampResult
  validationEnabled: boolean
}) {
  const selectValue = leavingType === 'sourdough' ? 'sourdough' : `yeast-${yeastType}`

  function handleChange(value: string) {
    if (value === 'sourdough') {
      onSelectLeavening('sourdough')
    } else if (value === 'yeast-instant') {
      onSelectLeavening('yeast')
      onSelectYeastType('instant')
    } else if (value === 'yeast-fresh') {
      onSelectLeavening('yeast')
      onSelectYeastType('fresh')
    }
  }

  return (
    <>
      <div style={{ marginBottom: tokens.spacing.md }}>
        <label>
          Leavening type{' '}
          <select
            value={selectValue}
            onChange={(e) => handleChange(e.target.value)}
          >
            <option value="sourdough">Sourdough</option>
            <option value="yeast-instant">Instant yeast</option>
            <option value="yeast-fresh">Fresh yeast</option>
          </select>
        </label>
      </div>
      {leavingType === 'sourdough' && (
        <div style={{ marginBottom: tokens.spacing.md }}>
          <label>
            Starter (%){' '}
            <input
              type="number"
              value={starterPercentInput.value}
              onChange={(e) => starterPercentInput.onChange(e.target.value)}
              onBlur={starterPercentInput.onBlur}
            />
          </label>
          {validationEnabled && <StarterPercentClampNote result={starterPercentClamp} />}
        </div>
      )}
    </>
  )
}

function RecipeCalculatorView() {
  const manualStarterEnabled = useFeatureFlag('manual-starter-percent')
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
  } = useRecipeCalculator(manualStarterEnabled ? 'sourdough' : 'yeast')

  const hydrationPresetEnabled = useFeatureFlag('hydration-preset')
  const validationEnabled = useFeatureFlag('validate-basic-inputs')
  const fermentationZoneEnabled = useFeatureFlag('fermentation-zone-feedback')
  const autoRecommendEnabled = useFeatureFlag('auto-recommend-starter-percent')

  const fermentation = useFermentationZone(doughTemperature, hydration)
  const bakeTime = useBakeTime(fermentation.duration)

  const bakingScheduleEnabled = useFeatureFlag('baking-schedule')

  const autoRecommendActive = autoRecommendEnabled && leavingType === 'sourdough'
  const effectiveDuration = autoRecommendActive ? bakeTime.duration : fermentation.duration

  useEffect(() => {
    if (autoRecommendActive) {
      fermentation.changeFermentationDuration(bakeTime.duration)
    }
  }, [autoRecommendActive, bakeTime.duration, fermentation.changeFermentationDuration])

  const recommendation = useStarterRecommendation(
    new FermentationWindow(effectiveDuration, doughTemperature, hydration, starterHydration),
  )

  useEffect(() => {
    if (autoRecommendActive) {
      changeStarterPercent(recommendation.effectivePercent)
    }
  }, [autoRecommendActive, recommendation.effectivePercent, changeStarterPercent])

  const schedule = useBakingSchedule(
    bakeTime.bakeTime,
    leavingType,
    doughTemperature,
    recommendation.effectiveMethod,
    effectiveDuration,
  )

  const weightInput = useNumberInput(
    recipe.finishedWeightPerLoaf,
    changeFinishedWeight,
  )
  const loafInput = useNumberInput(loaves, changeLoafCount)
  const saltInput = useNumberInput(Math.round(salt * 100), (n) =>
    changeSalt(n / 100),
  )
  const bakeOffLossInput = useNumberInput(Math.round(bakeOffLoss * 100), (n) =>
    changeBakeOffLoss(n / 100),
  )
  const handleStarterPercentChange = (n: number) => {
    if (autoRecommendActive) {
      recommendation.overrideStarterPercent(n / 100)
    } else {
      changeStarterPercent(n / 100)
    }
  }
  const starterPercentResetKey = autoRecommendActive
    ? `${leavingType}-${starterPercent}`
    : leavingType
  const starterPercentInput = useNumberInput(Math.round(starterPercent * 100), handleStarterPercentChange, starterPercentResetKey)
  const starterHydrationInput = useNumberInput(Math.round(starterHydration * 100), (n) =>
    changeStarterHydration(n / 100), leavingType,
  )
  const doughTemperatureInput = useNumberInput(doughTemperature, changeDoughTemperature, leavingType)
  const fermentationDurationInput = useNumberInput(fermentation.duration, fermentation.changeFermentationDuration, leavingType)

  return (
    <section
      aria-label="Recipe calculator"
      style={{ fontFamily: tokens.typography.fontFamily }}
    >
      <h1>Baker's Percentage Calculator</h1>

      <div style={{ marginBottom: tokens.spacing.md }}>
        <label>
          Finished weight (g){' '}
          <input
            type="number"
            value={weightInput.value}
            onChange={(e) => weightInput.onChange(e.target.value)}
            onBlur={weightInput.onBlur}
          />
        </label>
        {validationEnabled && <ClampNote result={clampNotes.finishedWeight} />}
      </div>

      {manualStarterEnabled ? (
        <LeaveningSelector
          leavingType={leavingType}
          yeastType={yeastType}
          onSelectLeavening={selectLeavening}
          onSelectYeastType={selectYeastType}
          starterPercentInput={starterPercentInput}
          starterPercentClamp={clampNotes.starterPercent}
          validationEnabled={validationEnabled}
        />
      ) : (
        <div style={{ marginBottom: tokens.spacing.md }}>
          <label>
            Yeast type{' '}
            <select
              value={yeastType}
              onChange={(e) =>
                selectYeastType(e.target.value as YeastType)
              }
            >
              <option value="instant">Instant</option>
              <option value="fresh">Fresh</option>
            </select>
          </label>
        </div>
      )}

      <div style={{ marginBottom: tokens.spacing.md }}>
        <label>
          Loaf count{' '}
          <input
            type="number"
            value={loafInput.value}
            onChange={(e) => loafInput.onChange(e.target.value)}
            onBlur={loafInput.onBlur}
          />
        </label>
        {validationEnabled && <ClampNote result={clampNotes.loaves} />}
      </div>

      {hydrationPresetEnabled && (
        <div
          role="group"
          aria-label="Hydration"
          style={{ marginBottom: tokens.spacing.md }}
        >
          {HYDRATION_PRESETS.map((preset) => (
            <button
              key={preset.name}
              aria-pressed={
                hydrationSelection.mode === 'preset' &&
                hydrationSelection.preset === preset.name
              }
              onClick={() => selectHydrationPreset(preset.name)}
              style={{ marginRight: tokens.spacing.sm }}
            >
              {preset.name}
            </button>
          ))}
          <button
            aria-label="Custom hydration"
            onClick={unlockCustomHydration}
            style={{ marginRight: tokens.spacing.sm }}
          >
            Custom
          </button>
          {hydrationSelection.mode === 'custom' && (
            <>
              <CustomHydrationInput
                percentage={hydrationSelection.percentage}
                onChange={enterCustomHydration}
              />
              {validationEnabled && <ClampNote result={clampNotes.hydration} />}
            </>
          )}
        </div>
      )}

      {validationEnabled && (
        <fieldset
          role="group"
          aria-label="Advanced"
          style={{ marginBottom: tokens.spacing.md, border: 'none', padding: 0 }}
        >
          <legend>Advanced</legend>
          <div style={{ marginBottom: tokens.spacing.sm }}>
            <label>
              Salt (%){' '}
              <input
                type="number"
                value={saltInput.value}
                onChange={(e) => saltInput.onChange(e.target.value)}
                onBlur={saltInput.onBlur}
              />
            </label>
            <ClampNote result={clampNotes.salt} />
          </div>
          <div style={{ marginBottom: tokens.spacing.sm }}>
            <label>
              Bake-off loss (%){' '}
              <input
                type="number"
                value={bakeOffLossInput.value}
                onChange={(e) => bakeOffLossInput.onChange(e.target.value)}
                onBlur={bakeOffLossInput.onBlur}
              />
            </label>
            <ClampNote result={clampNotes.bakeOffLoss} />
          </div>
          {manualStarterEnabled && leavingType === 'sourdough' && (
            <>
              <div style={{ marginBottom: tokens.spacing.sm }}>
                <label>
                  Starter hydration (%){' '}
                  <input
                    type="number"
                    value={starterHydrationInput.value}
                    onChange={(e) => starterHydrationInput.onChange(e.target.value)}
                    onBlur={starterHydrationInput.onBlur}
                  />
                </label>
                <ClampNote result={clampNotes.starterHydration} />
              </div>
              <div style={{ marginBottom: tokens.spacing.sm }}>
                <label>
                  Dough temperature (°C){' '}
                  <input
                    type="number"
                    value={doughTemperatureInput.value}
                    onChange={(e) => doughTemperatureInput.onChange(e.target.value)}
                    onBlur={doughTemperatureInput.onBlur}
                  />
                </label>
                <ClampNote result={clampNotes.doughTemperature} />
              </div>
            </>
          )}
        </fieldset>
      )}

      {fermentationZoneEnabled && leavingType === 'sourdough' && (
        <div style={{ marginBottom: tokens.spacing.md }}>
          {autoRecommendActive ? (
            <div style={{ marginBottom: tokens.spacing.sm }}>
              <label>
                Bake time{' '}
                <input
                  type="datetime-local"
                  value={formatDatetimeLocal(bakeTime.bakeTime)}
                  onChange={(e) => bakeTime.changeBakeTime(new Date(e.target.value))}
                />
              </label>
            </div>
          ) : (
            <div style={{ marginBottom: tokens.spacing.sm }}>
              <label>
                Fermentation duration (h){' '}
                <input
                  type="number"
                  value={fermentationDurationInput.value}
                  onChange={(e) => fermentationDurationInput.onChange(e.target.value)}
                  onBlur={fermentationDurationInput.onBlur}
                />
              </label>
              {validationEnabled && <ClampNote result={fermentation.clampNote} />}
            </div>
          )}
          {autoRecommendActive && (
            <>
              <div style={{ marginBottom: tokens.spacing.sm }}>
                <label>
                  Fermentation method{' '}
                  <select
                    value={recommendation.effectiveMethod}
                    onChange={(e) => recommendation.overrideMethod(e.target.value as FermentationMethod)}
                  >
                    <option value="same-day">Counter (same-day)</option>
                    <option value="cold-retard">Fridge (overnight)</option>
                  </select>
                </label>
              </div>
              <p role="note">
                {recommendation.isOverridden
                  ? `Manual override (recommended: ${Math.round(recommendation.recommendedPercent * 100)}%)`
                  : `Starter % recommended for ${effectiveDuration}h window at ${doughTemperature}°C / ${Math.round(hydration * 100)}% hydration`}
              </p>
              {recommendation.hasAnyOverride && (
                <button
                  onClick={() => recommendation.useRecommended()}
                  style={{ background: 'none', border: 'none', color: tokens.colors.textMuted, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                >
                  Use recommended
                </button>
              )}
            </>
          )}
          <p role="status">
            Fermentation zone:{' '}
            <strong>{fermentation.zone.charAt(0).toUpperCase() + fermentation.zone.slice(1)}</strong>
          </p>
          {fermentation.warning && (
            <p role="alert">{fermentation.warning}</p>
          )}
        </div>
      )}

      {bakingScheduleEnabled && leavingType !== 'sourdough' && (
        <div style={{ marginBottom: tokens.spacing.md }}>
          <label>
            Bake time{' '}
            <input
              type="datetime-local"
              value={formatDatetimeLocal(bakeTime.bakeTime)}
              onChange={(e) => bakeTime.changeBakeTime(new Date(e.target.value))}
            />
          </label>
        </div>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Ingredient</TableHeader>
            {loaves > 1 ? (
              <>
                <TableHeader>Per loaf</TableHeader>
                <TableHeader>Total</TableHeader>
              </>
            ) : (
              <TableHeader>Grams</TableHeader>
            )}
            <TableHeader>Baker's %</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {recipe.ingredients.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.grams}</TableCell>
              {loaves > 1 && (
                <TableCell>{row.grams * loaves}</TableCell>
              )}
              <TableCell>{formatPercentage(row.percentage)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p>
        Total dough weight: <strong>{recipe.totalDoughWeight}g</strong>
      </p>
      <p>
        Finished loaf weight:{' '}
        <strong>{recipe.finishedWeightPerLoaf}g</strong>
      </p>

      {bakingScheduleEnabled && schedule.length > 0 && (
        <section aria-label="Baking schedule" style={{ marginTop: tokens.spacing.lg }}>
          <h2>Baking Schedule</h2>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Step</TableHeader>
                <TableHeader>Time</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedule.map((event) => (
                <TableRow key={event.name}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{formatScheduleTime(event.time)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
    </section>
  )
}
