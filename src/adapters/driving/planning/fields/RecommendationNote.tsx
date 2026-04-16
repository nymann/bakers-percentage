import { tokens } from '../../../../design-system/tokens'

export function RecommendationNote({
  isOverridden,
  hasAnyOverride,
  recommendedPercent,
  effectiveDurationHours,
  doughTemperatureC,
  hydrationFraction,
  onUseRecommended,
}: {
  isOverridden: boolean
  hasAnyOverride: boolean
  recommendedPercent: number
  effectiveDurationHours: number
  doughTemperatureC: number
  hydrationFraction: number
  onUseRecommended: () => void
}) {
  return (
    <>
      <p role="note">
        {isOverridden
          ? `Manual override (recommended: ${Math.round(recommendedPercent * 100)}%)`
          : `Starter % recommended for ${effectiveDurationHours}h window at ${doughTemperatureC}°C / ${Math.round(hydrationFraction * 100)}% hydration`}
      </p>
      {hasAnyOverride && (
        <button
          onClick={onUseRecommended}
          style={{
            background: 'none',
            border: 'none',
            color: tokens.colors.textMuted,
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Use recommended
        </button>
      )}
    </>
  )
}
