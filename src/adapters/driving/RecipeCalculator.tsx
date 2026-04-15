import { useRef, useState } from 'react'
import { useRecipeCalculator } from '../../application/use-cases/useRecipeCalculator'
import type { YeastType } from '../../domain/Recipe'
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

function useNumberInput(value: number, onChange: (n: number) => void) {
  const [text, setText] = useState(String(value))
  const lastCommitted = useRef(value)

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

function RecipeCalculatorView() {
  const {
    recipe,
    loaves,
    yeastType,
    hydrationSelection,
    clampNotes,
    changeFinishedWeight,
    changeLoafCount,
    selectYeastType,
    selectHydrationPreset,
    enterCustomHydration,
    unlockCustomHydration,
  } = useRecipeCalculator()

  const hydrationPresetEnabled = useFeatureFlag('hydration-preset')
  const validationEnabled = useFeatureFlag('validate-basic-inputs')

  const weightInput = useNumberInput(
    recipe.finishedWeightPerLoaf,
    changeFinishedWeight,
  )
  const loafInput = useNumberInput(loaves, changeLoafCount)

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
