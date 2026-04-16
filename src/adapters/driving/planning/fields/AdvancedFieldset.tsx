import type { ReactNode } from 'react'
import { tokens } from '../../../../design-system/tokens'

export function AdvancedFieldset({ children }: { children: ReactNode }) {
  return (
    <fieldset
      role="group"
      aria-label="Advanced"
      style={{ marginBottom: tokens.spacing.md, border: 'none', padding: 0 }}
    >
      <legend>Advanced</legend>
      {children}
    </fieldset>
  )
}
