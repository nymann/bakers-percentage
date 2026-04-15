import { useRef, useState } from 'react'
import { useRecipeCalculator } from '../../application/use-cases/useRecipeCalculator'
import type { YeastType } from '../../domain/Recipe'
import type { LeavingType } from '../../domain/SourdoughRecipe'
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
  const starterPercentInput = useNumberInput(Math.round(starterPercent * 100), (n) =>
    changeStarterPercent(n / 100), leavingType,
  )
  const starterHydrationInput = useNumberInput(Math.round(starterHydration * 100), (n) =>
    changeStarterHydration(n / 100), leavingType,
  )
  const doughTemperatureInput = useNumberInput(doughTemperature, changeDoughTemperature, leavingType)

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
    </section>
  )
}
