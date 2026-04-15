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

describe('Scenario 05 (story 03): clamp bake-off loss to valid range', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'validate-basic-inputs': true,
  }

  it.each([
    { input: '2', result: 5 },
    { input: '30', result: 25 },
  ])(
    'clamps bake-off loss $input to $result and shows range note',
    async ({ input, result }) => {
      const user = userEvent.setup()
      renderWithFlags(allFlags)

      const advanced = screen.getByRole('group', { name: /advanced/i })
      const bakeOffInput = within(advanced).getByRole('spinbutton', {
        name: /bake-off loss/i,
      })
      await user.clear(bakeOffInput)
      await user.type(bakeOffInput, input)

      expect(
        screen.getByText(/valid range.*5.*25/i),
      ).toBeInTheDocument()

      await user.tab()
      expect(bakeOffInput).toHaveValue(result)
    },
  )
})

describe('Scenario 01 (story 04): selecting sourdough reveals starter inputs', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
  }

  it('shows starter % and starter hydration inputs when sourdough is selected', async () => {
    const user = userEvent.setup()
    renderWithFlags(allFlags)

    const leaveningSelect = screen.getByRole('combobox', {
      name: /leavening type/i,
    })

    // Start by selecting yeast to test switching to sourdough
    await user.selectOptions(leaveningSelect, 'yeast-instant')

    // Starter inputs should not be visible with yeast
    expect(
      screen.queryByRole('spinbutton', { name: /starter \(%\)/i }),
    ).not.toBeInTheDocument()

    // Switch to sourdough
    await user.selectOptions(leaveningSelect, 'sourdough')

    // Starter % input should appear
    expect(
      screen.getByRole('spinbutton', { name: /starter \(%\)/i }),
    ).toBeInTheDocument()

    // Starter hydration input should appear with default 100%
    const advanced = screen.getByRole('group', { name: /advanced/i })
    const starterHydrationInput = within(advanced).getByRole('spinbutton', {
      name: /starter hydration/i,
    })
    expect(starterHydrationInput).toHaveValue(100)
  })

  it('renders nothing sourdough-specific when flag is off', () => {
    renderWithFlags({
      'yeast-recipe-calculator': true,
      'manual-starter-percent': false,
    })

    expect(
      screen.queryByRole('combobox', { name: /leavening type/i }),
    ).not.toBeInTheDocument()

    // Old yeast type selector should still work
    expect(
      screen.getByRole('combobox', { name: /yeast type/i }),
    ).toBeInTheDocument()
  })
})

describe('Scenario 02 (story 04): recipe splits flour and water for starter', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
    'hydration-preset': true,
  }

  it('shows base flour, water, salt, starter rows with correct grams', async () => {
    const user = userEvent.setup()
    renderWithFlags(allFlags)

    // Default is sourdough with 10% starter. Change to 20%.
    const starterInput = screen.getByRole('spinbutton', {
      name: /starter \(%\)/i,
    })
    await user.clear(starterInput)
    await user.type(starterInput, '20')

    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const cells = rows.slice(1).map((row) =>
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    )

    expect(cells).toEqual([
      ['Base flour', '416', '80%'],
      ['Water', '286', '75%'],
      ['Salt', '10', '2%'],
      ['Starter', '208', '20%'],
    ])
  })

  it('total dough weight is the same regardless of starter percent', async () => {
    const user = userEvent.setup()
    renderWithFlags(allFlags)

    // Record total with default 10% starter
    const totalBefore = screen.getByText(/total dough weight/i).textContent

    // Change to 20% starter
    const starterInput = screen.getByRole('spinbutton', {
      name: /starter \(%\)/i,
    })
    await user.clear(starterInput)
    await user.type(starterInput, '20')

    const totalAfter = screen.getByText(/total dough weight/i).textContent
    expect(totalAfter).toBe(totalBefore)
  })
})

describe('Scenario 03 (story 04): clamp starter % for positive base flour', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
    'hydration-preset': true,
  }

  it('clamps starter % to max safe value and shows note', async () => {
    const user = userEvent.setup()
    renderWithFlags(allFlags)

    // Default sourdough with 75% hydration, 100% starter hydration
    // Max safe = min(0.99, 0.75/1.0) = 75%
    const starterInput = screen.getByRole('spinbutton', {
      name: /starter \(%\)/i,
    })
    await user.clear(starterInput)
    await user.type(starterInput, '100')

    expect(
      screen.getByText(/base flour must remain positive/i),
    ).toBeInTheDocument()

    await user.tab()
    expect(starterInput).toHaveValue(75)

    // Verify base flour is still positive
    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const baseFlourRow = rows.find((row) => {
      const cells = within(row).queryAllByRole('cell')
      return cells.length > 0 && cells[0].textContent === 'Base flour'
    })!
    const baseFlourGrams = Number(
      within(baseFlourRow).getAllByRole('cell')[1].textContent,
    )
    expect(baseFlourGrams).toBeGreaterThan(0)
  })
})

describe('Scenario 04 (story 04): clamp dough temperature to valid range', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
  }

  it.each([
    { input: '10', result: 15 },
    { input: '40', result: 35 },
  ])(
    'clamps dough temperature $input to $result and shows range note',
    async ({ input, result }) => {
      const user = userEvent.setup()
      renderWithFlags(allFlags)

      const advanced = screen.getByRole('group', { name: /advanced/i })
      const tempInput = within(advanced).getByRole('spinbutton', {
        name: /dough temperature/i,
      })
      await user.clear(tempInput)
      await user.type(tempInput, input)

      expect(
        screen.getByText(/valid range.*15.*35/i),
      ).toBeInTheDocument()

      await user.tab()
      expect(tempInput).toHaveValue(result)
    },
  )
})

describe('Scenario 05 (story 04): clamp starter hydration to valid range', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
  }

  it.each([
    { input: '30', result: 50 },
    { input: '250', result: 200 },
  ])(
    'clamps starter hydration $input to $result and shows range note',
    async ({ input, result }) => {
      const user = userEvent.setup()
      renderWithFlags(allFlags)

      const advanced = screen.getByRole('group', { name: /advanced/i })
      const hydrationInput = within(advanced).getByRole('spinbutton', {
        name: /starter hydration/i,
      })
      await user.clear(hydrationInput)
      await user.type(hydrationInput, input)

      expect(
        screen.getByText(/valid range.*50.*200/i),
      ).toBeInTheDocument()

      await user.tab()
      expect(hydrationInput).toHaveValue(result)
    },
  )
})

describe('Scenario 06 (story 04): sourdough is default leavening', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
  }

  it('defaults to sourdough with starter inputs visible', () => {
    renderWithFlags(allFlags)

    const leaveningSelect = screen.getByRole('combobox', {
      name: /leavening type/i,
    })
    expect(leaveningSelect).toHaveValue('sourdough')

    // Starter % input visible
    expect(
      screen.getByRole('spinbutton', { name: /starter \(%\)/i }),
    ).toBeInTheDocument()

    // Starter hydration shows 100%
    const advanced = screen.getByRole('group', { name: /advanced/i })
    const starterHydrationInput = within(advanced).getByRole('spinbutton', {
      name: /starter hydration/i,
    })
    expect(starterHydrationInput).toHaveValue(100)
  })

  it('shows sourdough recipe rows on first load', () => {
    renderWithFlags(allFlags)

    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const ingredientNames = rows.slice(1).map((row) =>
      within(row).getAllByRole('cell')[0].textContent,
    )

    expect(ingredientNames).toEqual(['Base flour', 'Water', 'Salt', 'Starter'])
  })
})

describe('Scenario 01 (story 04a): switch sourdough to instant yeast', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
    'hydration-preset': true,
  }

  it('hides sourdough inputs and shows yeast recipe', async () => {
    const user = userEvent.setup()
    renderWithFlags(allFlags)

    // Default is sourdough — verify sourdough table rows
    const table = screen.getByRole('table')
    let rows = within(table).getAllByRole('row')
    let ingredientNames = rows.slice(1).map((row) =>
      within(row).getAllByRole('cell')[0].textContent,
    )
    expect(ingredientNames).toEqual(['Base flour', 'Water', 'Salt', 'Starter'])

    // Switch to instant yeast
    const leaveningSelect = screen.getByRole('combobox', {
      name: /leavening type/i,
    })
    await user.selectOptions(leaveningSelect, 'yeast-instant')

    // Starter %, starter hydration, dough temperature inputs hidden
    expect(
      screen.queryByRole('spinbutton', { name: /starter \(%\)/i }),
    ).not.toBeInTheDocument()
    const advanced = screen.getByRole('group', { name: /advanced/i })
    expect(
      within(advanced).queryByRole('spinbutton', { name: /starter hydration/i }),
    ).not.toBeInTheDocument()
    expect(
      within(advanced).queryByRole('spinbutton', { name: /dough temperature/i }),
    ).not.toBeInTheDocument()

    // Results table shows yeast recipe rows
    rows = within(table).getAllByRole('row')
    const cells = rows.slice(1).map((row) =>
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    )

    expect(cells[0][0]).toBe('Flour')
    expect(cells[1][0]).toBe('Water')
    expect(cells[2][0]).toBe('Salt')
    expect(cells[3][0]).toBe('Yeast')

    // Yeast amount is F × 1%
    expect(cells[3][2]).toBe('1%')
  })
})

describe('Scenario 02 (story 04a): switch yeast to sourdough', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
    'hydration-preset': true,
  }

  it('shows sourdough inputs with defaults and sourdough recipe', async () => {
    const user = userEvent.setup()
    renderWithFlags(allFlags)

    // Switch to yeast first
    const leaveningSelect = screen.getByRole('combobox', {
      name: /leavening type/i,
    })
    await user.selectOptions(leaveningSelect, 'yeast-instant')

    // Switch back to sourdough
    await user.selectOptions(leaveningSelect, 'sourdough')

    // Starter % appears with default 10%
    const starterInput = screen.getByRole('spinbutton', {
      name: /starter \(%\)/i,
    })
    expect(starterInput).toHaveValue(10)

    // Starter hydration appears with default 100%
    const advanced = screen.getByRole('group', { name: /advanced/i })
    expect(
      within(advanced).getByRole('spinbutton', { name: /starter hydration/i }),
    ).toHaveValue(100)

    // Dough temperature appears with default 24°C
    expect(
      within(advanced).getByRole('spinbutton', { name: /dough temperature/i }),
    ).toHaveValue(24)

    // Results table shows sourdough rows
    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const ingredientNames = rows.slice(1).map((row) =>
      within(row).getAllByRole('cell')[0].textContent,
    )
    expect(ingredientNames).toEqual(['Base flour', 'Water', 'Salt', 'Starter'])
  })

  it('resets sourdough values to defaults when switching back', async () => {
    const user = userEvent.setup()
    renderWithFlags(allFlags)

    // Start sourdough, change starter to 30%
    const starterInput = screen.getByRole('spinbutton', {
      name: /starter \(%\)/i,
    })
    await user.clear(starterInput)
    await user.type(starterInput, '30')

    // Switch to yeast, then back to sourdough
    const leaveningSelect = screen.getByRole('combobox', {
      name: /leavening type/i,
    })
    await user.selectOptions(leaveningSelect, 'yeast-instant')
    await user.selectOptions(leaveningSelect, 'sourdough')

    // Starter % should be reset to default 10%, not stale 30%
    const resetStarterInput = screen.getByRole('spinbutton', {
      name: /starter \(%\)/i,
    })
    expect(resetStarterInput).toHaveValue(10)
  })
})

describe('Scenario 03 (story 04a): shared inputs preserved on switch', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
    'hydration-preset': true,
  }

  it('preserves loaves, weight, and hydration when switching to yeast', async () => {
    const user = userEvent.setup()
    renderWithFlags(allFlags)

    // Default is sourdough. Set 2 loaves, 900g, 70% hydration.
    const loafInput = screen.getByRole('spinbutton', { name: /loaf count/i })
    await user.clear(loafInput)
    await user.type(loafInput, '2')

    const weightInput = screen.getByRole('spinbutton', { name: /finished weight/i })
    await user.clear(weightInput)
    await user.type(weightInput, '900')

    const hydrationGroup = screen.getByRole('group', { name: /hydration/i })
    await user.click(
      within(hydrationGroup).getByRole('button', { name: /custom hydration/i }),
    )
    const hydrationInput = screen.getByRole('spinbutton', { name: /custom hydration/i })
    await user.clear(hydrationInput)
    await user.type(hydrationInput, '70')

    // Switch to instant yeast
    const leaveningSelect = screen.getByRole('combobox', { name: /leavening type/i })
    await user.selectOptions(leaveningSelect, 'yeast-instant')

    // Shared inputs preserved
    expect(loafInput).toHaveValue(2)
    expect(weightInput).toHaveValue(900)
    expect(
      screen.getByRole('spinbutton', { name: /custom hydration/i }),
    ).toHaveValue(70)

    // Recipe recalculates with yeast leavening using those values
    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const cells = rows.slice(1).map((row) =>
      within(row)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    )

    // Should show yeast rows, not sourdough rows
    expect(cells[0][0]).toBe('Flour')
    expect(cells[3][0]).toBe('Yeast')

    // Water percentage should be 70%
    expect(cells[1][3]).toBe('70%')
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

describe('Scenario 04 (story 05): default fermentation duration', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
    'fermentation-zone-feedback': true,
  }

  it('shows fermentation duration defaulting to 14h with green zone', () => {
    renderWithFlags(allFlags)

    const durationInput = screen.getByRole('spinbutton', {
      name: /fermentation duration/i,
    })
    expect(durationInput).toHaveValue(14)

    expect(screen.getByText(/green/i)).toBeInTheDocument()
  })

  it('hides fermentation zone when flag is off', () => {
    renderWithFlags({ ...allFlags, 'fermentation-zone-feedback': false })

    expect(
      screen.queryByRole('spinbutton', { name: /fermentation duration/i }),
    ).not.toBeInTheDocument()
  })

  it('hides fermentation zone when yeast is selected', async () => {
    const user = userEvent.setup()
    renderWithFlags(allFlags)

    const leaveningSelect = screen.getByRole('combobox', {
      name: /leavening type/i,
    })
    await user.selectOptions(leaveningSelect, 'yeast-instant')

    expect(
      screen.queryByRole('spinbutton', { name: /fermentation duration/i }),
    ).not.toBeInTheDocument()
  })
})

describe('Scenario 01 (story 05): green zone for ideal window', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
    'fermentation-zone-feedback': true,
  }

  it.each([6, 10, 14, 20, 24])(
    'shows green zone for %ih at 24°C/75%%',
    async (hours) => {
      const user = userEvent.setup()
      renderWithFlags(allFlags)

      const durationInput = screen.getByRole('spinbutton', {
        name: /fermentation duration/i,
      })
      await user.clear(durationInput)
      await user.type(durationInput, String(hours))

      expect(screen.getByRole('status')).toHaveTextContent(/green/i)
    },
  )
})

describe('Scenario 02 (story 05): yellow zone for tight/very sour window', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
    'fermentation-zone-feedback': true,
  }

  it.each([4, 5, 30, 36])(
    'shows yellow zone for %ih at 24°C/75%%',
    async (hours) => {
      const user = userEvent.setup()
      renderWithFlags(allFlags)

      const durationInput = screen.getByRole('spinbutton', {
        name: /fermentation duration/i,
      })
      await user.clear(durationInput)
      await user.type(durationInput, String(hours))

      expect(screen.getByRole('status')).toHaveTextContent(/yellow/i)
    },
  )
})

describe('Scenario 03 (story 05): red zone with warning', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
    'fermentation-zone-feedback': true,
  }

  it.each([
    { hours: 2, risk: 'Not feasible for sourdough' },
    { hours: 3, risk: 'Not feasible for sourdough' },
    { hours: 40, risk: 'Over-fermentation risk' },
    { hours: 48, risk: 'Over-fermentation risk' },
  ])(
    'shows red zone and "$risk" warning for $hours h',
    async ({ hours, risk }) => {
      const user = userEvent.setup()
      renderWithFlags(allFlags)

      const durationInput = screen.getByRole('spinbutton', {
        name: /fermentation duration/i,
      })
      await user.clear(durationInput)
      await user.type(durationInput, String(hours))

      expect(screen.getByRole('status')).toHaveTextContent(/red/i)
      expect(screen.getByRole('alert')).toHaveTextContent(risk)
    },
  )
})

describe('Scenario 05 (story 05): zone scales with dough temperature', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
    'fermentation-zone-feedback': true,
  }

  it.each([
    { temp: 27, hours: 4, zone: /green/i },
    { temp: 27, hours: 3, zone: /yellow/i },
    { temp: 21, hours: 6, zone: /yellow/i },
    { temp: 21, hours: 8, zone: /green/i },
  ])(
    'at $temp°C with $hours h shows $zone zone',
    async ({ temp, hours, zone }) => {
      const user = userEvent.setup()
      renderWithFlags(allFlags)

      const advanced = screen.getByRole('group', { name: /advanced/i })
      const tempInput = within(advanced).getByRole('spinbutton', {
        name: /dough temperature/i,
      })
      await user.clear(tempInput)
      await user.type(tempInput, String(temp))

      const durationInput = screen.getByRole('spinbutton', {
        name: /fermentation duration/i,
      })
      await user.clear(durationInput)
      await user.type(durationInput, String(hours))

      expect(screen.getByRole('status')).toHaveTextContent(zone)
    },
  )
})

describe('Scenario 05: override recommended starter percent', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
    'fermentation-zone-feedback': true,
    'auto-recommend-starter-percent': true,
  }

  it('shows recommendation note when auto-recommend is enabled', () => {
    renderWithFlags(allFlags)

    expect(screen.getByRole('note')).toHaveTextContent(
      /starter % recommended for.*window at.*hydration/i,
    )
  })

  it('renders nothing for auto-recommend when flag is off', () => {
    renderWithFlags({ ...allFlags, 'auto-recommend-starter-percent': false })

    expect(screen.queryByRole('note')).not.toBeInTheDocument()
  })

  it('shows manual override note when user changes starter %', async () => {
    const user = userEvent.setup()
    renderWithFlags(allFlags)

    const starterInput = screen.getByRole('spinbutton', { name: /starter \(%\)/i })
    await user.clear(starterInput)
    await user.type(starterInput, '15')

    expect(screen.getByRole('note')).toHaveTextContent(/manual override/i)
  })
})

describe('Scenario 06: override fermentation method', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
    'fermentation-zone-feedback': true,
    'auto-recommend-starter-percent': true,
  }

  it('shows method selector when auto-recommend is enabled', () => {
    renderWithFlags(allFlags)

    const methodSelect = screen.getByRole('combobox', { name: /fermentation method/i })
    expect(methodSelect).toBeInTheDocument()
  })

  it('recalculates starter % when method is overridden', async () => {
    const user = userEvent.setup()
    renderWithFlags(allFlags)

    const starterInput = screen.getByRole('spinbutton', { name: /starter \(%\)/i })
    const initialValue = Number(starterInput.getAttribute('value'))

    const methodSelect = screen.getByRole('combobox', { name: /fermentation method/i })
    await user.selectOptions(methodSelect, 'same-day')

    const newValue = Number(starterInput.getAttribute('value'))
    expect(newValue).not.toBe(initialValue)
  })
})

describe('Scenario 08: reset to recommended values', () => {
  const allFlags = {
    'yeast-recipe-calculator': true,
    'manual-starter-percent': true,
    'validate-basic-inputs': true,
    'fermentation-zone-feedback': true,
    'auto-recommend-starter-percent': true,
  }

  it('shows "Use recommended" when starter % is overridden', async () => {
    const user = userEvent.setup()
    renderWithFlags(allFlags)

    expect(screen.queryByRole('button', { name: /use recommended/i })).not.toBeInTheDocument()

    const starterInput = screen.getByRole('spinbutton', { name: /starter \(%\)/i })
    await user.clear(starterInput)
    await user.type(starterInput, '25')

    expect(screen.getByRole('button', { name: /use recommended/i })).toBeInTheDocument()
  })

  it('restores recommended values when "Use recommended" is clicked', async () => {
    const user = userEvent.setup()
    renderWithFlags(allFlags)

    const starterInput = screen.getByRole('spinbutton', { name: /starter \(%\)/i })
    const recommendedValue = starterInput.getAttribute('value')

    await user.clear(starterInput)
    await user.type(starterInput, '25')

    await user.click(screen.getByRole('button', { name: /use recommended/i }))

    expect(starterInput).toHaveValue(Number(recommendedValue))
    expect(screen.queryByRole('button', { name: /use recommended/i })).not.toBeInTheDocument()
    expect(screen.getByRole('note')).not.toHaveTextContent(/manual override/i)
  })
})
