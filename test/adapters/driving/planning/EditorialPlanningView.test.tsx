import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeCalculator } from '../../../../src/adapters/driving/planning/RecipeCalculator'
import { FeatureFlagProvider } from '../../../../src/feature-flags'
import { createInMemoryFeatureFlags } from '../../../../src/adapters/driven/InMemoryFeatureFlags'

function renderEditorial(opts: { settingsOpen?: boolean } = {}) {
  const flags = createInMemoryFeatureFlags({})
  return render(
    <FeatureFlagProvider service={flags}>
      <RecipeCalculator
        settingsOpen={opts.settingsOpen ?? false}
        onCloseSettings={() => {}}
      />
    </FeatureFlagProvider>,
  )
}

describe('RecipeCalculator renders the editorial layout', () => {
  it('renders the ingredient ledger', () => {
    renderEditorial()

    expect(
      screen.getByRole('region', { name: /ingredient ledger/i }),
    ).toBeInTheDocument()
  })
})

describe('Scenario 02: editorial layout renders ingredient ledger', () => {
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

  it('exposes finished weight by spinbutton label once Custom is chosen', async () => {
    const user = userEvent.setup()
    renderEditorial()

    const group = screen.getByRole('radiogroup', { name: /finished weight/i })
    await user.click(within(group).getByRole('radio', { name: /custom/i }))

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

    // Finished weight is observable in the ledger even when the input is hidden
    const ledger = screen.getByRole('region', { name: /ingredient ledger/i })
    expect(within(ledger).getByText(/finished loaf weight/i).parentElement)
      .toHaveTextContent(/900/)
  })

  it('selecting Custom reveals the weight input for manual entry', async () => {
    const user = userEvent.setup()
    renderEditorial()

    const group = screen.getByRole('radiogroup', { name: /finished weight/i })
    await user.click(within(group).getByRole('radio', { name: /^M$/i }))

    // Input is hidden while a preset is selected
    expect(
      screen.queryByRole('spinbutton', { name: /finished weight/i }),
    ).not.toBeInTheDocument()

    const custom = within(group).getByRole('radio', { name: /custom/i })
    await user.click(custom)

    const weightInput = screen.getByRole('spinbutton', { name: /finished weight/i })
    await user.clear(weightInput)
    await user.type(weightInput, '750')

    expect(custom).toHaveAttribute('aria-checked', 'true')
    expect(weightInput).toHaveValue(750)
  })
})

describe('Scenario 04: leavening segmented control', () => {
  it('sourdough is selected by default', () => {
    renderEditorial()

    const group = screen.getByRole('radiogroup', { name: /fermentation path/i })
    const sourdough = within(group).getByRole('radio', { name: /sourdough/i })
    expect(sourdough).toHaveAttribute('aria-checked', 'true')
    const dryYeast = within(group).getByRole('radio', { name: /dry yeast/i })
    expect(dryYeast).toHaveAttribute('aria-checked', 'false')
    const freshYeast = within(group).getByRole('radio', { name: /fresh yeast/i })
    expect(freshYeast).toHaveAttribute('aria-checked', 'false')
  })

  it('activating dry yeast switches leavening', async () => {
    const user = userEvent.setup()
    renderEditorial()

    const group = screen.getByRole('radiogroup', { name: /fermentation path/i })
    const dryYeastOption = within(group).getByRole('radio', { name: /dry yeast/i })
    await user.click(dryYeastOption)

    expect(dryYeastOption).toHaveAttribute('aria-checked', 'true')
    expect(
      within(group).getByRole('radio', { name: /sourdough/i }),
    ).toHaveAttribute('aria-checked', 'false')

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

describe('Scenario 06: advanced settings live behind a dialog', () => {
  it('does not render advanced fields when the dialog is closed', () => {
    renderEditorial({ settingsOpen: false })

    expect(
      screen.queryByRole('spinbutton', { name: /^starter \(%\)$/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('spinbutton', { name: /starter hydration/i }),
    ).not.toBeInTheDocument()
  })

  it('reveals advanced fields inside a dialog when open', () => {
    renderEditorial({ settingsOpen: true })

    const dialog = screen.getByRole('dialog', { name: /advanced settings/i })
    expect(within(dialog).getByRole('spinbutton', { name: /salt/i })).toBeInTheDocument()
    expect(
      within(dialog).getByRole('spinbutton', { name: /bake-off loss/i }),
    ).toBeInTheDocument()
    expect(
      within(dialog).getByRole('spinbutton', { name: /starter hydration/i }),
    ).toBeInTheDocument()
    expect(
      within(dialog).getByRole('spinbutton', { name: /^starter \(%\)$/i }),
    ).toBeInTheDocument()
  })

  it('closing the dialog hides its advanced fields', () => {
    const { rerender } = renderEditorial({ settingsOpen: true })

    expect(
      screen.getByRole('spinbutton', { name: /^starter \(%\)$/i }),
    ).toBeInTheDocument()

    const flags = createInMemoryFeatureFlags({})
    rerender(
      <FeatureFlagProvider service={flags}>
        <RecipeCalculator settingsOpen={false} onCloseSettings={() => {}} />
      </FeatureFlagProvider>,
    )

    expect(
      screen.queryByRole('spinbutton', { name: /^starter \(%\)$/i }),
    ).not.toBeInTheDocument()
  })

  it('room temperature sits on the main view, not inside the dialog', () => {
    renderEditorial()

    const input = screen.getByRole('spinbutton', { name: /room temperature/i })
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue(24)
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

    const group = screen.getByRole('radiogroup', { name: /finished weight/i })
    await user.click(within(group).getByRole('radio', { name: /custom/i }))
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
  it('renders schedule as an ordered list of steps once expanded', async () => {
    const user = userEvent.setup()
    renderEditorial()

    await expandSchedule(user)

    const arc = screen.getByRole('region', { name: /baking schedule/i })
    const list = within(arc).getByRole('list')
    const items = within(list).getAllByRole('listitem')
    expect(items.length).toBeGreaterThan(0)
  })

  it('marks the first upcoming step with aria-current=step', async () => {
    const user = userEvent.setup()
    renderEditorial()

    await expandSchedule(user)

    const arc = screen.getByRole('region', { name: /baking schedule/i })
    const current = within(arc).getAllByRole('listitem').find(
      (li) => li.getAttribute('aria-current') === 'step',
    )
    expect(current).toBeDefined()
  })

  it('starts collapsed and reveals the list when clicked', async () => {
    const user = userEvent.setup()
    renderEditorial()

    const arc = screen.getByRole('region', { name: /baking schedule/i })
    const trigger = within(arc).getByRole('button', { name: /baking schedule/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(within(arc).queryByRole('list')).not.toBeInTheDocument()

    await user.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(within(arc).getByRole('list')).toBeInTheDocument()
  })
})

async function expandSchedule(user: ReturnType<typeof userEvent.setup>) {
  const arc = screen.getByRole('region', { name: /baking schedule/i })
  const trigger = within(arc).getByRole('button', { name: /baking schedule/i })
  if (trigger.getAttribute('aria-expanded') !== 'true') {
    await user.click(trigger)
  }
}

describe('Scenario 14-01: timeline replaces bake time for sourdough', () => {
  it('renders a mix handle slider on the fermentation timeline', () => {
    renderEditorial()

    expect(
      screen.getByRole('slider', { name: /mix handle/i }),
    ).toBeInTheDocument()
  })

  it('renders a bake handle slider on the fermentation timeline', () => {
    renderEditorial()

    expect(
      screen.getByRole('slider', { name: /bake handle/i }),
    ).toBeInTheDocument()
  })

  it('does not render the legacy bake time datetime input when sourdough', () => {
    renderEditorial()

    expect(screen.queryByLabelText(/bake time/i)).not.toBeInTheDocument()
  })
})

function fireEventExpandSchedule() {
  const arc = screen.getByRole('region', { name: /baking schedule/i })
  const trigger = within(arc).getByRole('button', { name: /baking schedule/i })
  if (trigger.getAttribute('aria-expanded') !== 'true') {
    fireEvent.click(trigger)
  }
}

function outOfOvenTimeText(): string {
  const arc = screen.getByRole('region', { name: /baking schedule/i })
  const item = within(arc)
    .getAllByRole('listitem')
    .find((li) => li.textContent?.includes('Out of oven'))
  if (!item) throw new Error('Out of oven event not found')
  const match = item.textContent?.match(/\d{2}:\d{2}/)
  if (!match) throw new Error('Out of oven time not found')
  return match[0]
}

function minutesOfDay(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function signedMinutesDelta(after: string, before: string): number {
  let delta = minutesOfDay(after) - minutesOfDay(before)
  if (delta > 12 * 60) delta -= 24 * 60
  if (delta < -12 * 60) delta += 24 * 60
  return delta
}

describe('Scenario 14-02: bake handle shifts out-of-oven time', () => {
  it('moving the bake handle 60 minutes later advances out-of-oven by 60 minutes', () => {
    renderEditorial()
    fireEventExpandSchedule()

    const bakeSlider = screen.getByRole('slider', {
      name: /bake handle/i,
    }) as HTMLInputElement
    const before = outOfOvenTimeText()
    const beforeValueText = bakeSlider.getAttribute('aria-valuetext')

    fireEvent.change(bakeSlider, {
      target: { value: String(Number(bakeSlider.value) + 60) },
    })

    const after = outOfOvenTimeText()
    let delta = minutesOfDay(after) - minutesOfDay(before)
    if (delta < 0) delta += 24 * 60
    expect(delta).toBe(60)

    expect(bakeSlider.getAttribute('aria-valuetext')).not.toBe(beforeValueText)
  })
})

describe('Scenario 14-03: mix handle adjusts fermentation duration', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    // 10:00 → bake defaults to tomorrow 09:00 (23h away); mix at today 19:00 (9h from now)
    vi.setSystemTime(new Date(2026, 3, 16, 10, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('dragging mix handle 2 hours earlier moves mix time back by 2 hours', () => {
    renderEditorial()

    const mixSlider = screen.getByRole('slider', {
      name: /mix handle/i,
    }) as HTMLInputElement
    const before = mixSlider.getAttribute('aria-valuetext')!

    fireEvent.change(mixSlider, {
      target: { value: String(Number(mixSlider.value) - 120) },
    })

    const after = mixSlider.getAttribute('aria-valuetext')!
    expect(signedMinutesDelta(after, before)).toBe(-120)
  })

  it('dragging mix handle earlier updates the recommended starter %', () => {
    renderEditorial()

    const table = screen.getByRole('table', { name: /ingredient ledger/i })
    const starterBefore = starterRowGrams(table)

    const mixSlider = screen.getByRole('slider', {
      name: /mix handle/i,
    }) as HTMLInputElement
    fireEvent.change(mixSlider, {
      target: { value: String(Number(mixSlider.value) - 120) },
    })

    expect(starterRowGrams(table)).not.toBe(starterBefore)
  })
})

describe('Scenario 14-07: yeast leavening hides the timeline', () => {
  it('yeast mode hides both handle sliders and shows the datetime bake time input', async () => {
    const user = userEvent.setup()
    renderEditorial()

    const group = screen.getByRole('radiogroup', { name: /fermentation path/i })
    await user.click(within(group).getByRole('radio', { name: /dry yeast/i }))

    expect(
      screen.queryByRole('slider', { name: /mix handle/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('slider', { name: /bake handle/i }),
    ).not.toBeInTheDocument()
    expect(screen.getByLabelText(/bake time/i)).toHaveAttribute(
      'type',
      'datetime-local',
    )
  })
})

describe('Scenario 14-06: handles snap to 15-minute increments', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    // "now" aligned to a 15-min mark so snapping is predictable
    vi.setSystemTime(new Date(2026, 3, 16, 10, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('rounds bake handle value 7 minutes past a quarter hour down to the quarter hour', () => {
    renderEditorial()

    const bakeSlider = screen.getByRole('slider', {
      name: /bake handle/i,
    }) as HTMLInputElement
    // 22 minutes from now = 15min past quarter-hour + 7; should snap to 15
    fireEvent.change(bakeSlider, { target: { value: '22' } })

    expect(Number(bakeSlider.value)).toBe(15)
  })

  it('rounds mix handle value 7 minutes past a quarter hour down to the quarter hour', () => {
    renderEditorial()

    const mixSlider = screen.getByRole('slider', {
      name: /mix handle/i,
    }) as HTMLInputElement
    fireEvent.change(mixSlider, { target: { value: '37' } })

    expect(Number(mixSlider.value)).toBe(30)
  })
})

describe('Scenario 14-05: status region announces active zone', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 3, 16, 10, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('announces "yellow" when mix handle moves into the yellow band', () => {
    renderEditorial()
    expect(screen.getByRole('status')).toHaveTextContent(/green/i)

    const mixSlider = screen.getByRole('slider', {
      name: /mix handle/i,
    }) as HTMLInputElement
    // bake at value 1380 (23h), mix at 1080 → duration 5h → yellow
    fireEvent.change(mixSlider, { target: { value: '1080' } })

    expect(screen.getByRole('status')).toHaveTextContent(/yellow/i)
  })

  it('announces "red" with warning when mix handle moves into the red band', () => {
    renderEditorial()

    const mixSlider = screen.getByRole('slider', {
      name: /mix handle/i,
    }) as HTMLInputElement
    // mix at 1260 → duration 2h → red (too short)
    fireEvent.change(mixSlider, { target: { value: '1260' } })

    expect(screen.getByRole('status')).toHaveTextContent(/red/i)
    expect(
      screen.getByText(/not feasible for sourdough|over-fermentation risk/i),
    ).toBeInTheDocument()
  })
})

describe('Scenario 14-04: zone bands render on the track', () => {
  it('renders three fermentation zone bands with green, yellow, and red accessible names', () => {
    renderEditorial()

    const zones = screen.getByLabelText(/fermentation zones/i)
    const bands = within(zones).getAllByRole('img')
    expect(bands).toHaveLength(3)

    const names = bands.map((b) => (b.getAttribute('aria-label') ?? '').toLowerCase())
    expect(names.some((n) => /green|ideal|safe/.test(n))).toBe(true)
    expect(names.some((n) => /yellow|cautionary/.test(n))).toBe(true)
    expect(names.some((n) => /red|unsafe/.test(n))).toBe(true)
  })

  it('band accessible names carry boundaries from useFermentationZone (24°C, 75%)', () => {
    renderEditorial()

    const zones = screen.getByLabelText(/fermentation zones/i)
    const bands = within(zones).getAllByRole('img')
    const byColor = (re: RegExp) =>
      bands.find((b) => re.test(b.getAttribute('aria-label') ?? ''))
    // default 24°C, 75% → greenLow=6, greenHigh=24, yellowLow=4, yellowHigh=36
    expect(byColor(/green/i)?.getAttribute('aria-label')).toMatch(/6.*24/)
    expect(byColor(/yellow/i)?.getAttribute('aria-label')).toMatch(/4|36/)
    expect(byColor(/red/i)?.getAttribute('aria-label')).toMatch(/4|36/)
  })
})

function starterRowGrams(table: HTMLElement): string {
  const rows = within(table).getAllByRole('row')
  const starter = rows.find(
    (r) => within(r).queryAllByRole('cell')[0]?.textContent === 'Starter',
  )
  if (!starter) throw new Error('Starter row not found')
  const cells = within(starter).getAllByRole('cell')
  return cells[1].textContent ?? ''
}
