import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeCalculator } from '../../../../src/adapters/driving/planning/RecipeCalculator'
import { FeatureFlagProvider } from '../../../../src/feature-flags'
import { createInMemoryFeatureFlags } from '../../../../src/adapters/driven/InMemoryFeatureFlags'

function renderEditorial(overrides: Record<string, boolean> = {}) {
  const flags = createInMemoryFeatureFlags({
    'yeast-recipe-calculator': true,
    'hydration-preset': true,
    'validate-basic-inputs': true,
    'manual-starter-percent': true,
    'fermentation-zone-feedback': true,
    'auto-recommend-starter-percent': true,
    'baking-schedule': true,
    'visual-timeline': false,
    'editorial-planning': true,
    ...overrides,
  })
  return render(
    <FeatureFlagProvider service={flags}>
      <RecipeCalculator />
    </FeatureFlagProvider>,
  )
}

describe('Scenario 01: editorial-planning flag OFF preserves legacy calculator', () => {
  it('does not render editorial layout when flag is OFF', () => {
    const flags = createInMemoryFeatureFlags({
      'yeast-recipe-calculator': true,
      'editorial-planning': false,
    })
    render(
      <FeatureFlagProvider service={flags}>
        <RecipeCalculator />
      </FeatureFlagProvider>,
    )

    expect(
      screen.queryByRole('region', { name: /ingredient ledger/i }),
    ).not.toBeInTheDocument()
    // Legacy heading still present
    expect(
      screen.getByRole('heading', { level: 1, name: /baker's percentage/i }),
    ).toBeInTheDocument()
  })
})

describe('Scenario 02: editorial-planning flag ON renders editorial layout', () => {
  it('renders the ingredient ledger region', () => {
    renderEditorial()

    expect(
      screen.getByRole('region', { name: /ingredient ledger/i }),
    ).toBeInTheDocument()
  })

  it('renders an ingredient table queryable by role', () => {
    renderEditorial()

    const ledger = screen.getByRole('region', { name: /ingredient ledger/i })
    expect(within(ledger).getByRole('table')).toBeInTheDocument()
  })

  it('renders the baking schedule arc preview', () => {
    renderEditorial()

    expect(
      screen.getByRole('region', { name: /baking schedule/i }),
    ).toBeInTheDocument()
  })

  it('still exposes finished weight by spinbutton label', () => {
    renderEditorial()

    expect(
      screen.getByRole('spinbutton', { name: /finished weight/i }),
    ).toBeInTheDocument()
  })
})

describe('Scenario 03: finished weight S/M/L segmented presets', () => {
  it('exposes S/M/L options via aria-checked radios', () => {
    renderEditorial()

    const group = screen.getByRole('radiogroup', { name: /finished weight/i })
    expect(within(group).getByRole('radio', { name: /^S$/i })).toBeInTheDocument()
    expect(within(group).getByRole('radio', { name: /^M$/i })).toBeInTheDocument()
    expect(within(group).getByRole('radio', { name: /^L$/i })).toBeInTheDocument()
  })

  it('selecting M preset updates finished weight to 900g', async () => {
    const user = userEvent.setup()
    renderEditorial()

    const group = screen.getByRole('radiogroup', { name: /finished weight/i })
    const mediumOption = within(group).getByRole('radio', { name: /^M$/i })
    await user.click(mediumOption)

    expect(mediumOption).toHaveAttribute('aria-checked', 'true')
    expect(
      within(group).getByRole('radio', { name: /^S$/i }),
    ).toHaveAttribute('aria-checked', 'false')
    expect(
      within(group).getByRole('radio', { name: /^L$/i }),
    ).toHaveAttribute('aria-checked', 'false')

    expect(
      screen.getByRole('spinbutton', { name: /finished weight/i }),
    ).toHaveValue(900)
  })

  it('typing a custom value clears preset selection', async () => {
    const user = userEvent.setup()
    renderEditorial()

    const group = screen.getByRole('radiogroup', { name: /finished weight/i })
    await user.click(within(group).getByRole('radio', { name: /^M$/i }))

    const weightInput = screen.getByRole('spinbutton', { name: /finished weight/i })
    await user.clear(weightInput)
    await user.type(weightInput, '750')

    for (const option of within(group).getAllByRole('radio')) {
      expect(option).toHaveAttribute('aria-checked', 'false')
    }
  })
})

describe('Scenario 04: leavening toggle cards', () => {
  it('sourdough card is pressed by default', () => {
    renderEditorial()

    const sourdough = screen.getByRole('button', { name: /sourdough/i, pressed: true })
    expect(sourdough).toHaveAttribute('aria-pressed', 'true')
    const yeast = screen.getByRole('button', { name: /^yeast$/i })
    expect(yeast).toHaveAttribute('aria-pressed', 'false')
  })

  it('activating yeast card switches leavening', async () => {
    const user = userEvent.setup()
    renderEditorial()

    const yeastCard = screen.getByRole('button', { name: /^yeast$/i })
    await user.click(yeastCard)

    expect(yeastCard).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('button', { name: /sourdough/i }),
    ).toHaveAttribute('aria-pressed', 'false')

    // Recipe switched to yeast: Yeast row appears
    const table = screen.getByRole('table', { name: /ingredient ledger/i })
    const rows = within(table).getAllByRole('row')
    const names = rows.slice(1).map((r) => within(r).getAllByRole('cell')[0].textContent)
    expect(names).toContain('Yeast')
  })
})

describe('Scenario 05: hydration segmented control', () => {
  it('hydration presets expose aria-checked and custom escape hatch', async () => {
    const user = userEvent.setup()
    renderEditorial()

    const hydrationGroup = screen.getByRole('radiogroup', { name: /hydration/i })
    const high = within(hydrationGroup).getByRole('radio', { name: /high hydration|80%/i })

    await user.click(high)

    expect(high).toHaveAttribute('aria-checked', 'true')
  })

  it('picking Custom reveals a numeric hydration input', async () => {
    const user = userEvent.setup()
    renderEditorial()

    const hydrationGroup = screen.getByRole('radiogroup', { name: /hydration/i })
    const custom = within(hydrationGroup).getByRole('radio', { name: /custom/i })
    await user.click(custom)

    const hydrationInput = screen.getByRole('spinbutton', { name: /custom hydration/i })
    expect(hydrationInput).toBeInTheDocument()

    await user.clear(hydrationInput)
    await user.type(hydrationInput, '72')

    // Recipe recalculates — water at 72% hydration on 800g default
    // Verify by the visible hydration readout in the ledger header
    expect(hydrationInput).toHaveValue(72)
  })
})

describe('Scenario 06: advanced disclosure collapses', () => {
  it('advanced trigger defaults to collapsed', () => {
    renderEditorial()

    const trigger = screen.getByRole('button', { name: /advanced/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-controls')

    const panelId = trigger.getAttribute('aria-controls')!
    const panel = document.getElementById(panelId)
    expect(panel).toHaveAttribute('hidden')
  })

  it('activating advanced trigger reveals the panel and its inputs', async () => {
    const user = userEvent.setup()
    renderEditorial()

    const trigger = screen.getByRole('button', { name: /advanced/i })
    await user.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const panelId = trigger.getAttribute('aria-controls')!
    const panel = document.getElementById(panelId)!
    expect(panel).not.toHaveAttribute('hidden')

    expect(within(panel).getByRole('spinbutton', { name: /salt/i })).toBeInTheDocument()
    expect(within(panel).getByRole('spinbutton', { name: /bake-off loss/i })).toBeInTheDocument()
    expect(
      within(panel).getByRole('spinbutton', { name: /starter hydration/i }),
    ).toBeInTheDocument()
    expect(
      within(panel).getByRole('spinbutton', { name: /dough temperature/i }),
    ).toBeInTheDocument()
  })
})

describe('Scenario 07: ingredient ledger accessible', () => {
  it('ledger table has name, grams, and baker-percent cells', () => {
    renderEditorial()

    const ledger = screen.getByRole('region', { name: /ingredient ledger/i })
    const table = within(ledger).getByRole('table')
    const rows = within(table).getAllByRole('row')
    const data = rows.slice(1).map((r) =>
      within(r).getAllByRole('cell').map((c) => c.textContent),
    )

    // Each row has at least 3 cells: name, grams, baker's %
    for (const row of data) {
      expect(row.length).toBeGreaterThanOrEqual(3)
    }
    // First row is an ingredient with non-empty name
    expect(data[0][0]?.length ?? 0).toBeGreaterThan(0)
  })

  it('changing finished weight recomputes ledger grams', async () => {
    const user = userEvent.setup()
    renderEditorial()

    const table = screen.getByRole('table', { name: /ingredient ledger/i })
    const before = within(table)
      .getAllByRole('row')
      .slice(1)
      .map((r) => within(r).getAllByRole('cell')[1].textContent)

    const weightInput = screen.getByRole('spinbutton', { name: /finished weight/i })
    await user.clear(weightInput)
    await user.type(weightInput, '1200')

    const after = within(table)
      .getAllByRole('row')
      .slice(1)
      .map((r) => within(r).getAllByRole('cell')[1].textContent)

    expect(after).not.toEqual(before)
  })
})

describe('Scenario 08: baking schedule arc preview', () => {
  it('renders schedule as an ordered list of steps', () => {
    renderEditorial()

    const arc = screen.getByRole('region', { name: /baking schedule/i })
    const list = within(arc).getByRole('list')
    const items = within(list).getAllByRole('listitem')
    expect(items.length).toBeGreaterThan(0)
  })

  it('marks the first upcoming step with aria-current=step', () => {
    renderEditorial()

    const arc = screen.getByRole('region', { name: /baking schedule/i })
    const current = within(arc).getAllByRole('listitem').find(
      (li) => li.getAttribute('aria-current') === 'step',
    )
    expect(current).toBeDefined()
  })
})

describe('Scenario 09: bake time datetime input preserved', () => {
  it('renders datetime-local bake time input', () => {
    renderEditorial()

    const bakeTime = screen.getByLabelText(/bake time/i)
    expect(bakeTime).toHaveAttribute('type', 'datetime-local')
  })
})
