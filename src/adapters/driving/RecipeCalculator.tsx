import { useRecipeCalculator } from '../../application/use-cases/useRecipeCalculator'
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

function RecipeCalculatorView() {
  const recipe = useRecipeCalculator()

  return (
    <section
      aria-label="Recipe calculator"
      style={{ fontFamily: tokens.typography.fontFamily }}
    >
      <h1>Baker's Percentage Calculator</h1>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Ingredient</TableHeader>
            <TableHeader>Grams</TableHeader>
            <TableHeader>Baker's %</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {recipe.ingredients.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.grams}</TableCell>
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
