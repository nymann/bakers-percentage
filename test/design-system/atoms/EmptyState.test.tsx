import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from '../../../src/design-system/atoms/EmptyState'

describe('EmptyState primitive', () => {
  it('renders the title as the accessible name on a status region', () => {
    render(<EmptyState title="No past bakes yet" />)

    expect(
      screen.getByRole('status', { name: /no past bakes yet/i }),
    ).toBeInTheDocument()
  })

  it('renders an optional description paragraph', () => {
    render(
      <EmptyState
        title="No past bakes yet"
        description="Completed batches will appear here."
      />,
    )

    expect(
      screen.getByText(/completed batches will appear here/i),
    ).toBeInTheDocument()
  })

  it('omits the description when not provided', () => {
    render(<EmptyState title="No past bakes yet" />)

    const status = screen.getByRole('status', { name: /no past bakes yet/i })
    expect(status.querySelector('p')).toBeNull()
  })
})
