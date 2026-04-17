import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExecutionView } from '../../../../src/adapters/driving/execution/ExecutionView'
import { TestProviders } from '../../../helpers'
import type { ActiveBake } from '../../../../src/domain/Bake'

function futureBake(): ActiveBake {
  const start = Date.now()
  return {
    id: 'bake-1',
    name: 'Sourdough · 1 loaf · 900g',
    startedAtMs: start,
    recipe: {
      ingredients: [{ name: 'Flour', grams: 500, percentage: 1 }],
      totalDoughWeight: 900,
      finishedWeightPerLoaf: 900,
      loaves: 1,
      hydration: 0.75,
    },
    schedule: [
      { name: 'Mix', timeMs: start + 5 * 60_000 },
      { name: 'Shape', timeMs: start + 6 * 3600_000 },
      { name: 'Bake', timeMs: start + 8 * 3600_000 },
    ],
    checklist: [
      { label: 'First fold', checked: false, phase: 'Mix' },
      { label: 'Second fold', checked: false, phase: 'Mix' },
    ],
  }
}

function renderWithActive(override?: Partial<ActiveBake>) {
  return render(
    <TestProviders seed={{ active: { ...futureBake(), ...override } }}>
      <ExecutionView />
    </TestProviders>,
  )
}

describe('ExecutionView: empty state when no active batch', () => {
  it('shows an empty state', () => {
    render(
      <TestProviders>
        <ExecutionView />
      </TestProviders>,
    )
    expect(
      screen.getByRole('status', { name: /no bake in progress/i }),
    ).toBeInTheDocument()
  })
})

describe('ExecutionView: focus zone shows current and next steps', () => {
  it('renders the batch name as the top-level heading', () => {
    renderWithActive()
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/sourdough/i)
  })

  it('renders a "Now" region that contains the first and second schedule events', () => {
    renderWithActive()
    const now = screen.getByRole('region', { name: /now/i })
    expect(within(now).getByText('Mix')).toBeInTheDocument()
    expect(within(now).getByText('Shape')).toBeInTheDocument()
  })

  it('nests phase-matched checklist items under their step', () => {
    renderWithActive()
    const now = screen.getByRole('region', { name: /now/i })
    const checkboxes = within(now).getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(2)
    expect(within(now).getByText(/first fold/i)).toBeInTheDocument()
  })
})

describe('ExecutionView: live timeline at the bottom', () => {
  it('renders a full-schedule region listing every scheduled event', () => {
    renderWithActive()
    const timeline = screen.getByRole('region', { name: /full schedule/i })
    const items = within(timeline).getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })
})

describe('ExecutionView: checklist interaction persists through storage', () => {
  it('toggles a phase-nested checkbox when clicked', async () => {
    const user = userEvent.setup()
    renderWithActive()

    const now = screen.getByRole('region', { name: /now/i })
    const firstCheckbox = within(now).getAllByRole('checkbox')[0]!
    expect(firstCheckbox).toHaveAttribute('aria-checked', 'false')

    await user.click(firstCheckbox)
    const updated = within(screen.getByRole('region', { name: /now/i })).getAllByRole('checkbox')[0]!
    expect(updated).toHaveAttribute('aria-checked', 'true')
  })
})

describe('ExecutionView: oven guidance pill group', () => {
  it('renders a pill group for oven type', () => {
    renderWithActive()
    const ovenRegion = screen.getByRole('region', { name: /oven/i })
    expect(
      within(ovenRegion).getByRole('radio', { name: /dutch oven/i }),
    ).toBeInTheDocument()
    expect(
      within(ovenRegion).getByRole('radio', { name: /stone or steel/i }),
    ).toBeInTheDocument()
    expect(
      within(ovenRegion).getByRole('radio', { name: /sheet pan/i }),
    ).toBeInTheDocument()
  })

  it('shows temperature guidance only after an oven type is selected', async () => {
    const user = userEvent.setup()
    renderWithActive()

    expect(screen.queryByText(/230–260/)).toBeNull()

    await user.click(screen.getByRole('radio', { name: /dutch oven/i }))
    expect(screen.getByText(/230–260/)).toBeInTheDocument()
  })

  it('pre-selects oven type from the bake when it has one', () => {
    renderWithActive({ ovenType: 'stone-steel' })
    expect(screen.getByText(/240–260/)).toBeInTheDocument()
  })
})

describe('ExecutionView: marking a schedule step done', () => {
  it('offers a mark-done action for each focus step', () => {
    renderWithActive()
    const now = screen.getByRole('region', { name: /now/i })
    expect(
      within(now).getByRole('button', { name: /mark mix done/i }),
    ).toBeInTheDocument()
    expect(
      within(now).getByRole('button', { name: /mark shape done/i }),
    ).toBeInTheDocument()
  })

  it('removes a step from the focus zone once marked done', async () => {
    const user = userEvent.setup()
    renderWithActive()

    const now = screen.getByRole('region', { name: /now/i })
    expect(within(now).getByText('Mix')).toBeInTheDocument()

    await user.click(
      within(now).getByRole('button', { name: /mark mix done/i }),
    )

    const focusAfter = screen.getByRole('region', { name: /now/i })
    expect(within(focusAfter).queryByText('Mix')).toBeNull()
    expect(within(focusAfter).getByText('Shape')).toBeInTheDocument()
  })

  it('offers an undo action in the timeline for completed steps', async () => {
    const user = userEvent.setup()
    renderWithActive()

    const now = screen.getByRole('region', { name: /now/i })
    await user.click(
      within(now).getByRole('button', { name: /mark mix done/i }),
    )

    const timeline = screen.getByRole('region', { name: /full schedule/i })
    const undo = within(timeline).getByRole('button', { name: /undo mix/i })
    expect(undo).toBeInTheDocument()

    await user.click(undo)

    expect(
      within(screen.getByRole('region', { name: /now/i })).getByText('Mix'),
    ).toBeInTheDocument()
  })
})

describe('ExecutionView: "Is it done?" contextual card', () => {
  it('does not show the done-signals card before the bake phase starts', () => {
    renderWithActive()
    expect(screen.queryByRole('button', { name: /is it done/i })).toBeNull()
  })

  it('shows the done-signals card in the focus zone once the bake step is current', () => {
    renderWithActive({ completedEventIndices: [0, 1] })
    const focus = screen.getByRole('region', { name: /now/i })
    expect(
      within(focus).getByRole('button', { name: /is it done/i }),
    ).toBeInTheDocument()
  })
})

describe('ExecutionView: finishing a bake', () => {
  it('returns to the empty state after finishing', async () => {
    const user = userEvent.setup()
    renderWithActive()

    await user.click(screen.getByRole('button', { name: /finish bake/i }))

    expect(
      screen.getByRole('status', { name: /no bake in progress/i }),
    ).toBeInTheDocument()
  })
})
