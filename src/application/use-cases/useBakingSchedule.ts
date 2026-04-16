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
    if (leavingType === 'yeast' || !strategy) {
      return new YeastSchedule(bakeTime).events
    }
    return strategy.schedule(bakeTime)
  }, [bakeTime, leavingType, strategy])
}
