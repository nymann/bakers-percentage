import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExecutionView } from '../../../../src/adapters/driving/execution/ExecutionView'
import { TestProviders } from '../../../helpers'
import type { ActiveBake } from '../../../../src/domain/Bake'

const NOW_MS = Date.parse('2026-04-16T09:00:00.000Z')

const ACTIVE_BAKE: ActiveBake = {
  id: 'bake-1',
  name: 'Sourdough · 1 loaf · 900g',
  startedAtMs: NOW_MS,
  recipe: {
    ingredients: [{ name: 'Flour', grams: 500, percentage: 1 }],
    totalDoughWeight: 900,
    finishedWeightPerLoaf: 900,
    loaves: 1,
    hydration: 0.75,
  },
  schedule: [
    { name: 'Mix', timeMs: NOW_MS },
    { name: 'Shape', timeMs: NOW_MS + 6 * 3600_000 },
    { name: 'Bake', timeMs: NOW_MS + 8 * 3600_000 },
  ],
  checklist: [
    { label: 'First fold', checked: false },
    { label: 'Second fold', checked: false },
  ],
}

function renderWithActive() {
  return render(
    <TestProviders seed={{ active: ACTIVE_BAKE }}>
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

describe('ExecutionView: active batch renders schedule and checklist', () => {
  it('renders the batch name as the top-level heading', () => {
    renderWithActive()
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/sourdough/i)
  })

  it('renders a step checklist region with the seeded labels', () => {
    renderWithActive()
    const checklist = screen.getByRole('region', { name: /step checklist/i })
    const checkboxes = within(checklist).getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(2)
  })

  it('renders a progress arc region with the seeded schedule', () => {
    renderWithActive()
    const arc = screen.getByRole('region', { name: /progress arc/i })
    const items = within(arc).getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })
})

describe('ExecutionView: checklist interaction persists through storage', () => {
  it('toggles a checkbox on click', async () => {
    const user = userEvent.setup()
    renderWithActive()

    const checklist = screen.getByRole('region', { name: /step checklist/i })
    const firstCheckbox = within(checklist).getAllByRole('checkbox')[0]!

    expect(firstCheckbox).toHaveAttribute('aria-checked', 'false')
    await user.click(firstCheckbox)
    expect(firstCheckbox).toHaveAttribute('aria-checked', 'true')
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
