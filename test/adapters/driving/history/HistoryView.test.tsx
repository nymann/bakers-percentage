import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HistoryView } from '../../../../src/adapters/driving/history/HistoryView'

describe('Scenario 02: History panel scaffold structure', () => {
  it('renders a top-level heading for the History view', () => {
    render(<HistoryView />)

    expect(
      screen.getByRole('heading', { level: 1, name: /history/i }),
    ).toBeInTheDocument()
  })

  it('renders a past-bakes list region', () => {
    render(<HistoryView />)

    expect(
      screen.getByRole('region', { name: /past bakes/i }),
    ).toBeInTheDocument()
  })

  it('renders a detail pane region', () => {
    render(<HistoryView />)

    expect(
      screen.getByRole('region', { name: /bake detail/i }),
    ).toBeInTheDocument()
  })

  it('shows an accessible empty state when there are no past bakes', () => {
    render(<HistoryView />)

    expect(
      screen.getByRole('status', { name: /no past bakes/i }),
    ).toBeInTheDocument()
  })
})
