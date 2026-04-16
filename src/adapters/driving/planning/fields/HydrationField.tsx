import type { ClampResult } from '../../../../domain/InputRanges'
import type { HydrationPresetName, HydrationSelection } from '../../../../domain/Hydration'
import { HYDRATION_PRESETS } from '../../../../domain/Hydration'
import { useNumberInput } from '../../../../design-system/headless/useNumberInput'
import { tokens } from '../../../../design-system/tokens'
import { ClampNote } from '../ClampNote'

function CustomHydrationInput({
  percentage,
  onChange,
}: {
  percentage: number
  onChange: (fraction: number) => void
}) {
  const input = useNumberInput({
    value: Math.round(percentage * 100),
    onChange: (n) => onChange(n / 100),
  })
  return (
    <label>
      Custom hydration (%) <input {...input.getInputProps()} />
    </label>
  )
}

export function HydrationField({
  selection,
  clampNote,
  validationEnabled,
  onSelectPreset,
  onUnlockCustom,
  onEnterCustom,
}: {
  selection: HydrationSelection
  clampNote: ClampResult
  validationEnabled: boolean
  onSelectPreset: (name: HydrationPresetName) => void
  onUnlockCustom: () => void
  onEnterCustom: (fraction: number) => void
}) {
  return (
    <div role="group" aria-label="Hydration" style={{ marginBottom: tokens.spacing.md }}>
      {HYDRATION_PRESETS.map((preset) => (
        <button
          key={preset.name}
          aria-pressed={selection.mode === 'preset' && selection.preset === preset.name}
          onClick={() => onSelectPreset(preset.name)}
          style={{ marginRight: tokens.spacing.sm }}
        >
          {preset.name}
        </button>
      ))}
      <button
        aria-label="Custom hydration"
        onClick={onUnlockCustom}
        style={{ marginRight: tokens.spacing.sm }}
      >
        Custom
      </button>
      {selection.mode === 'custom' && (
        <>
          <CustomHydrationInput percentage={selection.percentage} onChange={onEnterCustom} />
          {validationEnabled && <ClampNote result={clampNote} />}
        </>
      )}
    </div>
  )
}
