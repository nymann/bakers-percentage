import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExecutionView } from '../../../../src/adapters/driving/execution/ExecutionView'

describe('Scenario 02: Execution panel structure', () => {
  it('renders a top-level heading for the active batch', () => {
    render(<ExecutionView />)

    expect(
      screen.getByRole('heading', { level: 1 }),
    ).toBeInTheDocument()
  })

  it('renders a step checklist region', () => {
    render(<ExecutionView />)

    expect(
      screen.getByRole('region', { name: /step checklist/i }),
    ).toBeInTheDocument()
  })

  it('renders a progress arc region', () => {
    render(<ExecutionView />)

    expect(
      screen.getByRole('region', { name: /progress arc/i }),
    ).toBeInTheDocument()
  })

  it('renders at least one fold-step checkbox inside the checklist', () => {
    render(<ExecutionView />)

    const checklist = screen.getByRole('region', { name: /step checklist/i })
    const checkboxes = within(checklist).getAllByRole('checkbox')
    expect(checkboxes.length).toBeGreaterThan(0)
  })

  it('renders at least one progress step inside the arc region', () => {
    render(<ExecutionView />)

    const arc = screen.getByRole('region', { name: /progress arc/i })
    const list = within(arc).getByRole('list')
    const items = within(list).getAllByRole('listitem')
    expect(items.length).toBeGreaterThan(0)
  })
})

describe('Scenario 03: Fold-step checkboxes toggle visually', () => {
  it('a fold-step checkbox toggles aria-checked on click', async () => {
    const user = userEvent.setup()
    render(<ExecutionView />)

    const checklist = screen.getByRole('region', { name: /step checklist/i })
    const checkboxes = within(checklist).getAllByRole('checkbox')
    const firstCheckbox = checkboxes[0]!

    expect(firstCheckbox).toHaveAttribute('aria-checked', 'false')

    await user.click(firstCheckbox)
    expect(firstCheckbox).toHaveAttribute('aria-checked', 'true')

    await user.click(firstCheckbox)
    expect(firstCheckbox).toHaveAttribute('aria-checked', 'false')
  })

  it('each fold-step checkbox toggles independently', async () => {
    const user = userEvent.setup()
    render(<ExecutionView />)

    const checklist = screen.getByRole('region', { name: /step checklist/i })
    const checkboxes = within(checklist).getAllByRole('checkbox')

    if (checkboxes.length < 2) return

    const first = checkboxes[0]!
    const second = checkboxes[1]!

    await user.click(first)
    expect(first).toHaveAttribute('aria-checked', 'true')
    expect(second).toHaveAttribute('aria-checked', 'false')
  })
})
