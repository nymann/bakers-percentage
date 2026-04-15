import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { RecipeCalculator } from './RecipeCalculator'
import { FeatureFlagProvider } from '../../feature-flags'
import { createInMemoryFeatureFlags } from '../driven/InMemoryFeatureFlags'

function renderWithFlags(flags: Record<string, boolean>) {
  const service = createInMemoryFeatureFlags(flags)
  return render(
    <FeatureFlagProvider service={service}>
      <RecipeCalculator />
    </FeatureFlagProvider>,
  )
}

describe('RecipeCalculator: defaults produce a recipe on load', () => {
  it('shows ingredient table with correct values', () => {
    renderWithFlags({ 'yeast-recipe-calculator': true })

    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')

    // Header + 4 ingredient rows
    expect(rows).toHaveLength(5)

    const cells = rows.slice(1).map((row) =>
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    )

    expect(cells).toEqual([
      ['Flour', '520', '100%'],
      ['Water', '390', '75%'],
      ['Salt', '10', '2%'],
      ['Yeast', '5', '1%'],
    ])
  })

  it('shows total dough weight of approximately 925g', () => {
    renderWithFlags({ 'yeast-recipe-calculator': true })

    const totalText = screen.getByText(/total dough weight/i)
    expect(totalText).toHaveTextContent(/9\d{2}g/)
  })

  it('shows finished loaf weight of 800g', () => {
    renderWithFlags({ 'yeast-recipe-calculator': true })

    expect(screen.getByText(/800g/)).toBeInTheDocument()
  })

  it('renders nothing when feature flag is off', () => {
    const { container } = renderWithFlags({
      'yeast-recipe-calculator': false,
    })

    expect(container).toBeEmptyDOMElement()
  })
})
