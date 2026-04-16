import { useMemo } from 'react'
import { YeastSchedule, type ScheduleEvent } from '../../domain/BakingSchedule'
import type { LeavingType } from '../../domain/SourdoughRecipe'
import type { FermentationStrategy } from '../../domain/Fermentation'

export function useBakingSchedule(
  bakeTime: Date,
  leavingType: LeavingType,
  strategy: FermentationStrategy | null,
): ScheduleEvent[] {
  return useMemo(() => {
    if (strategy) {
      return strategy.schedule(bakeTime)
    }
    return new YeastSchedule(bakeTime).events
  }, [bakeTime, leavingType, strategy])
}
