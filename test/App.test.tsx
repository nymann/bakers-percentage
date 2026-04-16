import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppContent } from '../src/App'
import { FeatureFlagProvider } from '../src/feature-flags'
import { createInMemoryFeatureFlags } from '../src/adapters/driven/InMemoryFeatureFlags'

function renderApp() {
  const flags = createInMemoryFeatureFlags({})
  return render(
    <FeatureFlagProvider service={flags}>
      <AppContent />
    </FeatureFlagProvider>,
  )
}

describe('AppContent renders the editorial shell', () => {
  it('renders the editorial shell chrome', () => {
    renderApp()

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getAllByRole('tab').length).toBeGreaterThan(0)
  })
})

describe('Scenario 02: editorial shell renders with Planning default', () => {
  it('shows a banner with the app branding', () => {
    renderApp()

    const banner = screen.getByRole('banner')
    expect(banner).toHaveTextContent(/the perfect bread/i)
  })

  it('lists Planning, Execution, and History tabs in a navigation region', () => {
    renderApp()

    const nav = screen.getByRole('navigation', { name: /primary views/i })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /planning/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /execution/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /history/i })).toBeInTheDocument()
  })

  it('marks Planning as the active tab by default', () => {
    renderApp()

    const planningTab = screen.getByRole('tab', { name: /planning/i })
    expect(planningTab).toHaveAttribute('aria-selected', 'true')
  })

  it('shows only the Planning panel', () => {
    renderApp()

    const planningPanel = screen.getByRole('tabpanel', { name: /planning/i })
    expect(planningPanel).toBeVisible()

    const visiblePanels = screen.getAllByRole('tabpanel')
    expect(visiblePanels).toHaveLength(1)

    const executionTab = screen.getByRole('tab', { name: /execution/i })
    const executionPanel = document.getElementById(
      executionTab.getAttribute('aria-controls') ?? '',
    )
    expect(executionPanel).toHaveAttribute('hidden')

    const historyTab = screen.getByRole('tab', { name: /history/i })
    const historyPanel = document.getElementById(
      historyTab.getAttribute('aria-controls') ?? '',
    )
    expect(historyPanel).toHaveAttribute('hidden')
  })

  it('renders the RecipeCalculator inside the Planning panel', () => {
    renderApp()

    const planningPanel = screen.getByRole('tabpanel', { name: /planning/i })
    const calculator = screen.getByRole('region', { name: /recipe calculator/i })
    expect(planningPanel).toContainElement(calculator)
  })
})

describe('Scenario 03: Execution and History are marked as coming soon', () => {
  it('marks the Execution tab as aria-disabled', () => {
    renderApp()

    expect(screen.getByRole('tab', { name: /execution/i })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
  })

  it('marks the History tab as aria-disabled', () => {
    renderApp()

    expect(screen.getByRole('tab', { name: /history/i })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
  })

  it('clicking a disabled tab does not switch the active panel', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('tab', { name: /execution/i }))

    expect(screen.getByRole('tab', { name: /planning/i })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tab', { name: /execution/i })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  })
})

describe('Scenario 06: side nav is the single navigation surface', () => {
  it('exposes exactly one primary-views navigation region', () => {
    renderApp()

    const navs = screen.getAllByRole('navigation', { name: /primary views/i })
    expect(navs).toHaveLength(1)
  })

  it('does not render a separate mobile navigation region', () => {
    renderApp()

    expect(
      screen.queryByRole('navigation', { name: /mobile views/i }),
    ).not.toBeInTheDocument()
  })
})

describe('Scenario 07: settings cogwheel in side nav opens the advanced dialog', () => {
  it('exposes a settings button in the side nav', () => {
    renderApp()

    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument()
  })

  it('advanced dialog is not present before the cogwheel is activated', () => {
    renderApp()

    expect(
      screen.queryByRole('dialog', { name: /advanced settings/i }),
    ).not.toBeInTheDocument()
  })

  it('activating the cogwheel reveals the advanced dialog', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: /settings/i }))

    expect(
      screen.getByRole('dialog', { name: /advanced settings/i }),
    ).toBeInTheDocument()
  })
})
