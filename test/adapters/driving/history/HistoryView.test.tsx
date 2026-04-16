import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HistoryView } from '../../../../src/adapters/driving/history/HistoryView'
import { TestProviders } from '../../../helpers'
import type { FinishedBake } from '../../../../src/domain/Bake'

const NOW_MS = Date.parse('2026-04-16T12:00:00.000Z')

const BAKE_A: FinishedBake = {
  id: 'bake-a',
  name: 'Sourdough · 1 loaf · 900g',
  startedAtMs: NOW_MS - 8 * 3600_000,
  finishedAtMs: NOW_MS,
  recipe: {
    ingredients: [{ name: 'Flour', grams: 500, percentage: 1 }],
    totalDoughWeight: 900,
    finishedWeightPerLoaf: 900,
    loaves: 1,
    hydration: 0.75,
  },
  schedule: [{ name: 'Bake', timeMs: NOW_MS }],
  checklist: [{ label: 'Shape', checked: true }],
}

function renderEmpty() {
  return render(
    <TestProviders>
      <HistoryView />
    </TestProviders>,
  )
}

function renderSeeded(bakes: readonly FinishedBake[]) {
  return render(
    <TestProviders seed={{ history: bakes }}>
      <HistoryView />
    </TestProviders>,
  )
}

describe('HistoryView: empty state', () => {
  it('renders the top-level History heading', () => {
    renderEmpty()
    expect(
      screen.getByRole('heading', { level: 1, name: /history/i }),
    ).toBeInTheDocument()
  })

  it('renders the past-bakes region with an accessible empty state', () => {
    renderEmpty()
    const list = screen.getByRole('region', { name: /past bakes/i })
    expect(
      within(list).getByRole('status', { name: /no past bakes/i }),
    ).toBeInTheDocument()
  })

  it('renders a detail pane region', () => {
    renderEmpty()
    expect(
      screen.getByRole('region', { name: /bake detail/i }),
    ).toBeInTheDocument()
  })
})

describe('HistoryView: with past bakes', () => {
  it('lists each past bake in the past-bakes region', () => {
    renderSeeded([BAKE_A])
    const list = screen.getByRole('region', { name: /past bakes/i })
    expect(within(list).getByText(BAKE_A.name)).toBeInTheDocument()
  })

  it('shows the bake formula in the detail pane when selected', async () => {
    const user = userEvent.setup()
    renderSeeded([BAKE_A])

    await user.click(
      screen.getByRole('button', { name: new RegExp(`^${BAKE_A.name}`, 'i') }),
    )

    const detail = screen.getByRole('region', { name: /bake detail/i })
    expect(within(detail).getByRole('region', { name: /ingredient ledger/i }))
      .toBeInTheDocument()
  })
})
