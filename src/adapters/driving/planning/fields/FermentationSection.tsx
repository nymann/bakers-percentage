import type { FermentationMethod } from '../../../../domain/Fermentation'
import type { ClampResult } from '../../../../domain/InputRanges'
import { tokens } from '../../../../design-system/tokens'
import { BakeTimeField } from './BakeTimeField'
import { FermentationDurationField } from './FermentationDurationField'
import { FermentationMethodField } from './FermentationMethodField'
import { RecommendationNote } from './RecommendationNote'
import { FermentationZoneStatus } from './FermentationZoneStatus'

export function FermentationSection({
  autoRecommendActive,
  bakeTime,
  onChangeBakeTime,
  duration,
  onChangeDuration,
  durationClamp,
  validationEnabled,
  zone,
  warning,
  effectiveMethod,
  onOverrideMethod,
  effectiveDurationHours,
  doughTemperatureC,
  hydrationFraction,
  recommendedPercent,
  isOverridden,
  hasAnyOverride,
  onUseRecommended,
  resetKey,
}: {
  autoRecommendActive: boolean
  bakeTime: Date
  onChangeBakeTime: (time: Date) => void
  duration: number
  onChangeDuration: (hours: number) => void
  durationClamp: ClampResult
  validationEnabled: boolean
  zone: string
  warning: string | null
  effectiveMethod: FermentationMethod
  onOverrideMethod: (method: FermentationMethod) => void
  effectiveDurationHours: number
  doughTemperatureC: number
  hydrationFraction: number
  recommendedPercent: number
  isOverridden: boolean
  hasAnyOverride: boolean
  onUseRecommended: () => void
  resetKey?: unknown
}) {
  return (
    <div style={{ marginBottom: tokens.spacing.md }}>
      {autoRecommendActive ? (
        <BakeTimeField bakeTime={bakeTime} onChange={onChangeBakeTime} />
      ) : (
        <FermentationDurationField
          hours={duration}
          onChange={onChangeDuration}
          clampNote={durationClamp}
          validationEnabled={validationEnabled}
          resetKey={resetKey}
        />
      )}
      {autoRecommendActive && (
        <>
          <FermentationMethodField method={effectiveMethod} onChange={onOverrideMethod} />
          <RecommendationNote
            isOverridden={isOverridden}
            hasAnyOverride={hasAnyOverride}
            recommendedPercent={recommendedPercent}
            effectiveDurationHours={effectiveDurationHours}
            doughTemperatureC={doughTemperatureC}
            hydrationFraction={hydrationFraction}
            onUseRecommended={onUseRecommended}
          />
        </>
      )}
      <FermentationZoneStatus zone={zone} warning={warning} />
    </div>
  )
}
