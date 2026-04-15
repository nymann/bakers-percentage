import { describe, it, expect } from 'vitest'
import { execSync } from 'node:child_process'

describe('Architecture: Port-Adapter Boundaries', () => {
  it('has no forbidden dependency violations', () => {
    try {
      execSync('npx depcruise --config .dependency-cruiser.cjs src', {
        encoding: 'utf-8',
        stdio: 'pipe',
      })
    } catch (error) {
      const output = (error as { stdout?: string }).stdout ?? ''
      expect.fail(`Architecture violations:\n${output}`)
    }
  })
})
