import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('Scenario 02: changing finished weight recalculates ingredients', () => {
  it('increases ingredient grams when finished weight increases', async () => {
    const user = userEvent.setup()
    renderWithFlags({ 'yeast-recipe-calculator': true })

    const weightInput = screen.getByRole('spinbutton', {
      name: /finished weight/i,
    })
    expect(weightInput).toHaveValue(800)

    await user.clear(weightInput)
    await user.type(weightInput, '1000')

    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const cells = rows.slice(1).map((row) =>
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    )

    // Grams increase but percentages stay the same
    expect(cells).toEqual([
      ['Flour', '649', '100%'],
      ['Water', '487', '75%'],
      ['Salt', '13', '2%'],
      ['Yeast', '6', '1%'],
    ])
  })
})

describe('Scenario 01: changing loaf count updates total but not per-loaf', () => {
  it('doubles total dough weight when loaf count changes to 2', async () => {
    const user = userEvent.setup()
    renderWithFlags({ 'yeast-recipe-calculator': true })

    const loafInput = screen.getByRole('spinbutton', {
      name: /loaf count/i,
    })
    expect(loafInput).toHaveValue(1)

    await user.clear(loafInput)
    await user.type(loafInput, '2')

    // Per-loaf grams unchanged
    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const cells = rows.slice(1).map((row) =>
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    )
    expect(cells[0][0]).toBe('Flour')
    expect(cells[0][1]).toBe('520')

    // Total dough weight doubled
    const totalText = screen.getByText(/total dough weight/i)
    expect(totalText).toHaveTextContent(/1849g/)

    // Finished weight per loaf unchanged
    expect(screen.getByText(/800g/)).toBeInTheDocument()
  })
})

describe('Scenario 05: multiple loaves shows per-loaf and total columns', () => {
  it('shows per-loaf and total columns when loaf count is 3', async () => {
    const user = userEvent.setup()
    renderWithFlags({ 'yeast-recipe-calculator': true })

    const loafInput = screen.getByRole('spinbutton', {
      name: /loaf count/i,
    })
    await user.clear(loafInput)
    await user.type(loafInput, '3')

    const table = screen.getByRole('table')
    const headers = within(table)
      .getAllByRole('columnheader')
      .map((h) => h.textContent)
    expect(headers).toContain('Per loaf')
    expect(headers).toContain('Total')

    const rows = within(table).getAllByRole('row')
    const flourCells = within(rows[1])
      .getAllByRole('cell')
      .map((c) => c.textContent)

    expect(flourCells).toEqual(['Flour', '520', '1560', '100%'])
  })

  it('shows single Grams column when loaf count is 1', () => {
    renderWithFlags({ 'yeast-recipe-calculator': true })

    const table = screen.getByRole('table')
    const headers = within(table)
      .getAllByRole('columnheader')
      .map((h) => h.textContent)
    expect(headers).toContain('Grams')
    expect(headers).not.toContain('Per loaf')
    expect(headers).not.toContain('Total')
  })
})

describe('Hydration preset feature flag', () => {
  it('hides hydration controls when flag is off', () => {
    renderWithFlags({
      'yeast-recipe-calculator': true,
      'hydration-preset': false,
    })

    expect(
      screen.queryByRole('group', { name: /hydration/i }),
    ).not.toBeInTheDocument()

    // Calculator still works at default 75%
    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const waterCells = within(rows[2])
      .getAllByRole('cell')
      .map((c) => c.textContent)
    expect(waterCells).toContain('390')
    expect(waterCells).toContain('75%')
  })
})

describe('Scenario 01 (story 02): selecting Classic hydration preset recalculates recipe', () => {
  it('updates hydration to 68% and recalculates ingredient grams', async () => {
    const user = userEvent.setup()
    renderWithFlags({
      'yeast-recipe-calculator': true,
      'hydration-preset': true,
    })

    const hydrationGroup = screen.getByRole('group', { name: /hydration/i })
    const classicButton = within(hydrationGroup).getByRole('button', {
      name: /classic/i,
    })

    await user.click(classicButton)

    expect(classicButton).toHaveAttribute('aria-pressed', 'true')

    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const cells = rows.slice(1).map((row) =>
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    )

    expect(cells).toEqual([
      ['Flour', '541', '100%'],
      ['Water', '368', '68%'],
      ['Salt', '11', '2%'],
      ['Yeast', '5', '1%'],
    ])
  })
})

describe('Scenario 02 (story 02): selecting High hydration preset recalculates recipe', () => {
  it('updates hydration to 82% and recalculates ingredient grams', async () => {
    const user = userEvent.setup()
    renderWithFlags({
      'yeast-recipe-calculator': true,
      'hydration-preset': true,
    })

    const hydrationGroup = screen.getByRole('group', { name: /hydration/i })
    const highButton = within(hydrationGroup).getByRole('button', {
      name: /high hydration/i,
    })

    await user.click(highButton)

    expect(highButton).toHaveAttribute('aria-pressed', 'true')

    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const cells = rows.slice(1).map((row) =>
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    )

    expect(cells).toEqual([
      ['Flour', '500', '100%'],
      ['Water', '410', '82%'],
      ['Salt', '10', '2%'],
      ['Yeast', '5', '1%'],
    ])
  })
})

describe('Scenario 03 (story 02): entering custom hydration overrides presets', () => {
  it('shows custom input and recalculates with 70% hydration', async () => {
    const user = userEvent.setup()
    renderWithFlags({
      'yeast-recipe-calculator': true,
      'hydration-preset': true,
    })

    const hydrationGroup = screen.getByRole('group', { name: /hydration/i })

    // Open crumb is the default preset
    const openCrumbButton = within(hydrationGroup).getByRole('button', {
      name: /open crumb/i,
    })
    expect(openCrumbButton).toHaveAttribute('aria-pressed', 'true')

    // Click the Custom button to unlock custom input
    const percentageButton = within(hydrationGroup).getByRole('button', {
      name: /custom hydration/i,
    })
    await user.click(percentageButton)

    // Custom input should appear
    const customInput = screen.getByRole('spinbutton', {
      name: /custom hydration/i,
    })
    expect(customInput).toHaveValue(75)

    // Enter custom value
    await user.clear(customInput)
    await user.type(customInput, '70')

    // No preset should be active
    const presetButtons = within(hydrationGroup)
      .getAllByRole('button')
      .filter((btn) => btn.getAttribute('aria-pressed') !== null)
    for (const btn of presetButtons) {
      expect(btn).toHaveAttribute('aria-pressed', 'false')
    }

    // Recipe recalculated with 70%
    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const cells = rows.slice(1).map((row) =>
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    )

    expect(cells).toEqual([
      ['Flour', '535', '100%'],
      ['Water', '374', '70%'],
      ['Salt', '11', '2%'],
      ['Yeast', '5', '1%'],
    ])
  })
})

describe('Scenario 04 (story 02): returning to preset from custom hydration', () => {
  it('closes custom input and reactivates Classic preset', async () => {
    const user = userEvent.setup()
    renderWithFlags({
      'yeast-recipe-calculator': true,
      'hydration-preset': true,
    })

    const hydrationGroup = screen.getByRole('group', { name: /hydration/i })

    // Enter custom mode
    const percentageButton = within(hydrationGroup).getByRole('button', {
      name: /custom hydration/i,
    })
    await user.click(percentageButton)

    const customInput = screen.getByRole('spinbutton', {
      name: /custom hydration/i,
    })
    await user.clear(customInput)
    await user.type(customInput, '71')

    // Verify custom mode: no preset active
    expect(
      within(hydrationGroup).getByRole('button', { name: /classic/i }),
    ).toHaveAttribute('aria-pressed', 'false')

    // Click Classic preset
    await user.click(
      within(hydrationGroup).getByRole('button', { name: /classic/i }),
    )

    // Custom input should be gone
    expect(
      screen.queryByRole('spinbutton', { name: /custom hydration/i }),
    ).not.toBeInTheDocument()

    // Classic is active
    expect(
      within(hydrationGroup).getByRole('button', { name: /classic/i }),
    ).toHaveAttribute('aria-pressed', 'true')

    // Recipe recalculated with 68%
    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const cells = rows.slice(1).map((row) =>
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    )

    expect(cells).toEqual([
      ['Flour', '541', '100%'],
      ['Water', '368', '68%'],
      ['Salt', '11', '2%'],
      ['Yeast', '5', '1%'],
    ])
  })
})

describe('Scenario 01 (story 03): clamp loaves to valid range', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'validate-basic-inputs': true,
  }

  it.each([
    { input: '0', result: 1 },
    { input: '-1', result: 1 },
    { input: '25', result: 20 },
  ])(
    'clamps loaf count $input to $result and shows range note',
    async ({ input, result }) => {
      const user = userEvent.setup()
      renderWithFlags(allFlags)

      const loafInput = screen.getByRole('spinbutton', {
        name: /loaf count/i,
      })
      await user.clear(loafInput)
      await user.type(loafInput, input)

      expect(screen.getByText(/valid range.*1.*20/i)).toBeInTheDocument()

      await user.tab()
      expect(loafInput).toHaveValue(result)
    },
  )

  it('hides range note when validate-basic-inputs flag is off', async () => {
    const user = userEvent.setup()
    renderWithFlags({
      'yeast-recipe-calculator': true,
      'validate-basic-inputs': false,
    })

    const loafInput = screen.getByRole('spinbutton', {
      name: /loaf count/i,
    })
    await user.clear(loafInput)
    await user.type(loafInput, '25')

    expect(
      screen.queryByText(/valid range.*1.*20/i),
    ).not.toBeInTheDocument()
  })
})

describe('Scenario 02 (story 03): clamp finished weight to valid range', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'validate-basic-inputs': true,
  }

  it.each([
    { input: '50', result: 100 },
    { input: '6000', result: 5000 },
  ])(
    'clamps finished weight $input to $result and shows range note',
    async ({ input, result }) => {
      const user = userEvent.setup()
      renderWithFlags(allFlags)

      const weightInput = screen.getByRole('spinbutton', {
        name: /finished weight/i,
      })
      await user.clear(weightInput)
      await user.type(weightInput, input)

      expect(
        screen.getByText(/valid range.*100.*5000/i),
      ).toBeInTheDocument()

      await user.tab()
      expect(weightInput).toHaveValue(result)
    },
  )
})

describe('Scenario 03 (story 03): clamp hydration to valid range', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'hydration-preset': true,
    'validate-basic-inputs': true,
  }

  it.each([
    { input: '30', result: 50 },
    { input: '110', result: 100 },
  ])(
    'clamps hydration $input to $result and shows range note',
    async ({ input, result }) => {
      const user = userEvent.setup()
      renderWithFlags(allFlags)

      const hydrationGroup = screen.getByRole('group', {
        name: /hydration/i,
      })
      await user.click(
        within(hydrationGroup).getByRole('button', {
          name: /custom hydration/i,
        }),
      )

      const customInput = screen.getByRole('spinbutton', {
        name: /custom hydration/i,
      })
      await user.clear(customInput)
      await user.type(customInput, input)

      expect(
        screen.getByText(/valid range.*50.*100/i),
      ).toBeInTheDocument()

      await user.tab()
      expect(customInput).toHaveValue(result)
    },
  )
})

describe('Scenario 04 (story 03): clamp salt to valid range', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'validate-basic-inputs': true,
  }

  it.each([
    { input: '-1', result: 0 },
    { input: '8', result: 5 },
  ])(
    'clamps salt $input to $result and shows range note',
    async ({ input, result }) => {
      const user = userEvent.setup()
      renderWithFlags(allFlags)

      const advanced = screen.getByRole('group', { name: /advanced/i })
      const saltInput = within(advanced).getByRole('spinbutton', {
        name: /salt/i,
      })
      await user.clear(saltInput)
      await user.type(saltInput, input)

      expect(
        screen.getByText(/valid range.*0.*5/i),
      ).toBeInTheDocument()

      await user.tab()
      expect(saltInput).toHaveValue(result)
    },
  )

  it('hides advanced section when validate-basic-inputs flag is off', () => {
    renderWithFlags({
      'yeast-recipe-calculator': true,
      'validate-basic-inputs': false,
    })

    expect(
      screen.queryByRole('group', { name: /advanced/i }),
    ).not.toBeInTheDocument()
  })
})

describe('Scenario 03: selecting instant yeast shows 1% yeast', () => {
  it('defaults to instant yeast with yeast at 1%', () => {
    renderWithFlags({ 'yeast-recipe-calculator': true })

    const yeastSelect = screen.getByRole('combobox', {
      name: /yeast type/i,
    })
    expect(yeastSelect).toHaveValue('instant')

    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const yeastRow = rows.find((row) => {
      const cells = within(row).queryAllByRole('cell')
      return cells.length > 0 && cells[0].textContent === 'Yeast'
    })!
    const yeastCells = within(yeastRow)
      .getAllByRole('cell')
      .map((c) => c.textContent)

    expect(yeastCells).toContain('5')
    expect(yeastCells).toContain('1%')
  })
})

describe('Scenario 04: selecting fresh yeast shows 3% yeast', () => {
  it('updates yeast to 3% when fresh yeast is selected', async () => {
    const user = userEvent.setup()
    renderWithFlags({ 'yeast-recipe-calculator': true })

    const yeastSelect = screen.getByRole('combobox', {
      name: /yeast type/i,
    })
    await user.selectOptions(yeastSelect, 'fresh')

    expect(yeastSelect).toHaveValue('fresh')

    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const yeastRow = rows.find((row) => {
      const cells = within(row).queryAllByRole('cell')
      return cells.length > 0 && cells[0].textContent === 'Yeast'
    })!
    const yeastCells = within(yeastRow)
      .getAllByRole('cell')
      .map((c) => c.textContent)

    expect(yeastCells).toContain('16')
    expect(yeastCells).toContain('3%')
  })
})
