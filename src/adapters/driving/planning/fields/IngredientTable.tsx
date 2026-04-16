import type { RecipeOutput } from '../../../../domain/Recipe'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '../../../../design-system/atoms/Table'
import { formatPercentage } from '../format'

export function IngredientTable({
  recipe,
  loaves,
}: {
  recipe: RecipeOutput
  loaves: number
}) {
  const multiLoaf = loaves > 1

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Ingredient</TableHeader>
            {multiLoaf ? (
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
              {multiLoaf && <TableCell>{row.grams * loaves}</TableCell>}
              <TableCell>{formatPercentage(row.percentage)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p>
        Total dough weight: <strong>{recipe.totalDoughWeight}g</strong>
      </p>
      <p>
        Finished loaf weight: <strong>{recipe.finishedWeightPerLoaf}g</strong>
      </p>
    </>
  )
}
