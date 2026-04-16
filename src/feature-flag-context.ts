import { createContext } from 'react'
import type { FeatureFlagService } from './application/ports/FeatureFlagPort'

export const FeatureFlagContext = createContext<FeatureFlagService | null>(null)
