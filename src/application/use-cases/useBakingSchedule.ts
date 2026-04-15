import { useMemo } from 'react'
import { createSchedule, type ScheduleEvent } from '../../domain/BakingSchedule'
import type { LeavingType } from '../../domain/SourdoughRecipe'
import type { FermentationMethod } from '../../domain/StarterRecommendation'

export function useBakingSchedule(
  bakeTime: Date,
  leavingType: LeavingType,
  doughTempC: number,
  fermentationMethod: FermentationMethod,
  totalHours: number,
): ScheduleEvent[] {
  return useMemo(
    () => createSchedule({ bakeTime, leavingType, doughTempC, fermentationMethod, totalHours }).events,
    [bakeTime, leavingType, doughTempC, fermentationMethod, totalHours],
  )
}
