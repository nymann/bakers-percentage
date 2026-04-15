import { useCallback, useMemo, useState } from 'react'
import { FermentationAssessment } from '../../domain/FermentationZone'
import {
  FERMENTATION_DURATION_RANGE,
  type ClampResult,
} from '../../domain/InputRanges'

const DEFAULT_DURATION = 14

const INITIAL_CLAMP_NOTE: ClampResult = {
  value: DEFAULT_DURATION,
  clamped: false,
  range: FERMENTATION_DURATION_RANGE,
}

export function useFermentationZone(tempC: number, hydration: number) {
  const [duration, setDuration] = useState(DEFAULT_DURATION)
  const [clampNote, setClampNote] = useState<ClampResult>(INITIAL_CLAMP_NOTE)

  const assessment = useMemo(
    () => new FermentationAssessment(duration, tempC, hydration),
    [duration, tempC, hydration],
  )

  const zone = assessment.zone
  const warning = assessment.warning

  const changeFermentationDuration = useCallback((hours: number) => {
    const result = FERMENTATION_DURATION_RANGE.clamp(hours)
    setDuration(result.value)
    setClampNote(result)
  }, [])

  return { duration, zone, warning, clampNote, changeFermentationDuration }
}
