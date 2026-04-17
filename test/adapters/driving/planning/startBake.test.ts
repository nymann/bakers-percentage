import { describe, it, expect } from 'vitest'
import { checklistFor } from '../../../../src/adapters/driving/planning/startBake'
import {
  ColdRetardSchedule,
  SameDaySchedule,
  YeastSchedule,
} from '../../../../src/domain/BakingSchedule'

const BAKE_TIME = new Date('2026-04-17T09:00:00')

function scheduleNames(method: 'same-day' | 'cold-retard' | 'yeast' | 'yeast-retard'): string[] {
  if (method === 'same-day') {
    return new SameDaySchedule(BAKE_TIME, 3).events.map((e) => e.name)
  }
  if (method === 'cold-retard') {
    return new ColdRetardSchedule(BAKE_TIME, 3, 24).events.map((e) => e.name)
  }
  if (method === 'yeast') {
    return new YeastSchedule(BAKE_TIME).events.map((e) => e.name)
  }
  return new ColdRetardSchedule(BAKE_TIME, 1.5, 14, {
    includeStarterFeed: false,
  }).events.map((e) => e.name)
}

describe('checklistFor: each method produces phases that exist in its schedule', () => {
  it.each([
    ['same-day'] as const,
    ['cold-retard'] as const,
    ['yeast'] as const,
    ['yeast-retard'] as const,
  ])('%s', (method) => {
    const names = new Set(scheduleNames(method))
    const orphaned = checklistFor(method).filter((item) => !names.has(item.phase))
    expect(orphaned).toEqual([])
  })
})
