import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppContent } from '../src/App'
import { FeatureFlagProvider } from '../src/feature-flags'
import { createInMemoryFeatureFlags } from '../src/adapters/driven/InMemoryFeatureFlags'

function setViewport({ desktop }: { desktop: boolean }) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('1024px') ? desktop : false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

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
  it('shows a banner containing the top app bar', () => {
    renderApp()

    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('lists Planning, Execution, and History tabs in a navigation region', () => {
    renderApp()

    const nav = screen.getAllByRole('navigation')[0]
    expect(nav).toBeInTheDocument()
    const tabs = screen.getAllByRole('tab')
    const tabNames = tabs.map((tab) => tab.textContent?.trim())
    expect(tabNames).toEqual(
      expect.arrayContaining(['Planning', 'Execution', 'History']),
    )
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
    const heading = screen.getByRole('heading', {
      level: 1,
      name: /baker's percentage/i,
    })
    expect(planningPanel).toContainElement(heading)
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

describe('Scenario 06: mobile viewport renders bottom nav', () => {
  it('shows the Mobile views nav and hides the Primary views side nav', () => {
    setViewport({ desktop: false })
    renderApp()

    const mobileNav = screen.getByRole('navigation', { name: /mobile views/i })
    expect(mobileNav).toBeInTheDocument()

    expect(
      screen.queryByRole('navigation', { name: /primary views/i }),
    ).not.toBeInTheDocument()
  })

  it('renders all three tabs within the mobile nav', () => {
    setViewport({ desktop: false })
    renderApp()

    const mobileNav = screen.getByRole('navigation', { name: /mobile views/i })
    const tabs = mobileNav.querySelectorAll('[role="tab"]')
    const labels = Array.from(tabs).map((tab) => tab.textContent?.trim())
    expect(labels).toEqual(['Planning', 'Execution', 'History'])
  })

  it('clicking a tab in the bottom nav switches the active view', async () => {
    const user = userEvent.setup()
    setViewport({ desktop: false })
    renderApp()

    await user.click(screen.getByRole('tab', { name: /history/i }))

    expect(screen.getByRole('tab', { name: /history/i })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(
      screen.getByRole('tabpanel', { name: /history/i }),
    ).toBeVisible()
  })

  it('desktop viewport shows Primary views side nav and hides Mobile views', () => {
    setViewport({ desktop: true })
    renderApp()

    expect(
      screen.getByRole('navigation', { name: /primary views/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('navigation', { name: /mobile views/i }),
    ).not.toBeInTheDocument()
  })
})
