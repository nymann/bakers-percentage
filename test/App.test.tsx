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
    expect(screen.getByRole('tab', { name: /^planning$/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /^execution$/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /^history$/i })).toBeInTheDocument()
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

describe('Scenario 03: clicking a nav tab switches the view', () => {
  it('activates the Execution tab and panel, deactivating Planning', async () => {
    const user = userEvent.setup()
    renderApp()

    const executionTab = screen.getByRole('tab', { name: /execution/i })
    await user.click(executionTab)

    expect(screen.getByRole('tab', { name: /execution/i })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tab', { name: /planning/i })).toHaveAttribute(
      'aria-selected',
      'false',
    )

    const executionPanel = screen.getByRole('tabpanel', { name: /execution/i })
    expect(executionPanel).toBeVisible()

    const planningTab = screen.getByRole('tab', { name: /planning/i })
    const planningPanel = document.getElementById(
      planningTab.getAttribute('aria-controls') ?? '',
    )
    expect(planningPanel).toHaveAttribute('hidden')
  })
})

describe('Scenario 04: arrow keys cycle tabs', () => {
  it('ArrowRight moves focus and selection through tabs, wrapping at the end', async () => {
    const user = userEvent.setup()
    renderApp()

    screen.getByRole('tab', { name: /planning/i }).focus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: /execution/i })).toHaveFocus()
    expect(screen.getByRole('tab', { name: /execution/i })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: /history/i })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: /planning/i })).toHaveFocus()
  })
})

describe('Scenario 05: Home and End keys jump to edges', () => {
  it('Home jumps from Execution to Planning', async () => {
    const user = userEvent.setup()
    renderApp()

    screen.getByRole('tab', { name: /execution/i }).focus()
    await user.keyboard('{Home}')

    expect(screen.getByRole('tab', { name: /planning/i })).toHaveFocus()
    expect(screen.getByRole('tab', { name: /planning/i })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('End jumps from any tab to History', async () => {
    const user = userEvent.setup()
    renderApp()

    screen.getByRole('tab', { name: /execution/i }).focus()
    await user.keyboard('{End}')

    expect(screen.getByRole('tab', { name: /history/i })).toHaveFocus()
    expect(screen.getByRole('tab', { name: /history/i })).toHaveAttribute(
      'aria-selected',
      'true',
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
