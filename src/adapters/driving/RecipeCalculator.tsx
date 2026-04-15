import { useState } from 'react'
import { useRecipeCalculator } from '../../application/use-cases/useRecipeCalculator'
import type { YeastType } from '../../domain/Recipe'
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

export function RecipeCalculator() {
  const enabled = useFeatureFlag('yeast-recipe-calculator')
  if (!enabled) return null

  return <RecipeCalculatorView />
}

function useNumberInput(initial: number, onChange: (n: number) => void) {
  const [text, setText] = useState(String(initial))

  function handleChange(value: string) {
    setText(value)
    const n = Number(value)
    if (value !== '' && !Number.isNaN(n)) {
      onChange(n)
    }
  }

  return { value: text, onChange: handleChange }
}

function RecipeCalculatorView() {
  const {
    recipe,
    loaves,
    yeastType,
    changeFinishedWeight,
    changeLoafCount,
    selectYeastType,
  } = useRecipeCalculator()

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
          />
        </label>
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
          />
        </label>
      </div>

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
