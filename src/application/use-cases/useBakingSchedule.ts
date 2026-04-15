import { useMemo } from 'react'
import { generateSchedule, type ScheduleEvent } from '../../domain/BakingSchedule'
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
    () => generateSchedule({ bakeTime, leavingType, doughTempC, fermentationMethod, totalHours }),
    [bakeTime, leavingType, doughTempC, fermentationMethod, totalHours],
  )
}
