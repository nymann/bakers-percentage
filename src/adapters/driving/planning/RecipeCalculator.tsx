import { useEffect } from 'react'
import { useRecipeCalculator } from '../../../application/use-cases/useRecipeCalculator'
import { useFermentationZone } from '../../../application/use-cases/useFermentationZone'
import { useStarterRecommendation } from '../../../application/use-cases/useStarterRecommendation'
import { useBakeTime } from '../../../application/use-cases/useBakeTime'
import { useBakingSchedule } from '../../../application/use-cases/useBakingSchedule'
import { useFeatureFlag } from '../../../use-feature-flag'
import { tokens } from '../../../design-system/tokens'
import { FinishedWeightField } from './fields/FinishedWeightField'
import { LeaveningField } from './fields/LeaveningField'
import { StarterPercentField } from './fields/StarterPercentField'
import { YeastTypeField } from './fields/YeastTypeField'
import { LoafCountField } from './fields/LoafCountField'
import { HydrationField } from './fields/HydrationField'
import { AdvancedFieldset } from './fields/AdvancedFieldset'
import { SaltField } from './fields/SaltField'
import { BakeOffLossField } from './fields/BakeOffLossField'
import { StarterHydrationField } from './fields/StarterHydrationField'
import { DoughTemperatureField } from './fields/DoughTemperatureField'
import { FermentationSection } from './fields/FermentationSection'
import { BakeTimeField } from './fields/BakeTimeField'
import { IngredientTable } from './fields/IngredientTable'
import { BakingScheduleTable } from './fields/BakingScheduleTable'

export function RecipeCalculator() {
  const enabled = useFeatureFlag('yeast-recipe-calculator')
  if (!enabled) return null

  return <RecipeCalculatorView />
}

function RecipeCalculatorView() {
  const manualStarterEnabled = useFeatureFlag('manual-starter-percent')
  const hydrationPresetEnabled = useFeatureFlag('hydration-preset')
  const validationEnabled = useFeatureFlag('validate-basic-inputs')
  const fermentationZoneEnabled = useFeatureFlag('fermentation-zone-feedback')
  const autoRecommendEnabled = useFeatureFlag('auto-recommend-starter-percent')
  const bakingScheduleEnabled = useFeatureFlag('baking-schedule')

  const {
    recipe,
    hydration,
    loaves,
    salt,
    bakeOffLoss,
    yeastType,
    leavingType,
    starterPercent,
    starterHydration,
    doughTemperature,
    hydrationSelection,
    clampNotes,
    changeFinishedWeight,
    changeLoafCount,
    changeSalt,
    changeBakeOffLoss,
    selectYeastType,
    selectHydrationPreset,
    enterCustomHydration,
    unlockCustomHydration,
    selectLeavening,
    changeStarterPercent,
    changeStarterHydration,
    changeDoughTemperature,
  } = useRecipeCalculator(manualStarterEnabled ? 'sourdough' : 'yeast')

  const fermentation = useFermentationZone(doughTemperature, hydration)
  const { changeFermentationDuration } = fermentation
  const bakeTime = useBakeTime(fermentation.duration)

  const autoRecommendActive = autoRecommendEnabled && leavingType === 'sourdough'
  const effectiveDuration = autoRecommendActive ? bakeTime.duration : fermentation.duration

  useEffect(() => {
    if (autoRecommendActive) {
      changeFermentationDuration(bakeTime.duration)
    }
  }, [autoRecommendActive, bakeTime.duration, changeFermentationDuration])

  const recommendation = useStarterRecommendation(doughTemperature, hydration, effectiveDuration)

  useEffect(() => {
    if (autoRecommendActive) {
      changeStarterPercent(recommendation.effectivePercent)
    }
  }, [autoRecommendActive, recommendation.effectivePercent, changeStarterPercent])

  const schedule = useBakingSchedule(
    bakeTime.bakeTime,
    leavingType,
    leavingType === 'sourdough' ? recommendation.effectiveStrategy : null,
  )

  const handleStarterPercentChange = (fraction: number) => {
    if (autoRecommendActive) {
      recommendation.overrideStarterPercent(fraction)
    } else {
      changeStarterPercent(fraction)
    }
  }

  const starterPercentResetKey = autoRecommendActive
    ? `${leavingType}-${starterPercent}`
    : leavingType

  const showSourdoughAdvanced = manualStarterEnabled && leavingType === 'sourdough'
  const showFermentationSection = fermentationZoneEnabled && leavingType === 'sourdough'
  const showYeastBakeTime = bakingScheduleEnabled && leavingType !== 'sourdough'

  return (
    <section
      aria-label="Recipe calculator"
      style={{ fontFamily: tokens.typography.fontFamily }}
    >
      <h1>Baker's Percentage Calculator</h1>

      <FinishedWeightField
        weight={recipe.finishedWeightPerLoaf}
        onChange={changeFinishedWeight}
        clampNote={clampNotes.finishedWeight}
        validationEnabled={validationEnabled}
      />

      {manualStarterEnabled ? (
        <>
          <LeaveningField
            leavingType={leavingType}
            yeastType={yeastType}
            onSelectLeavening={selectLeavening}
            onSelectYeastType={selectYeastType}
          />
          {leavingType === 'sourdough' && (
            <StarterPercentField
              percent={starterPercent}
              onChange={handleStarterPercentChange}
              clampNote={clampNotes.starterPercent}
              validationEnabled={validationEnabled}
              resetKey={starterPercentResetKey}
            />
          )}
        </>
      ) : (
        <YeastTypeField yeastType={yeastType} onSelectYeastType={selectYeastType} />
      )}

      <LoafCountField
        loaves={loaves}
        onChange={changeLoafCount}
        clampNote={clampNotes.loaves}
        validationEnabled={validationEnabled}
      />

      {hydrationPresetEnabled && (
        <HydrationField
          selection={hydrationSelection}
          clampNote={clampNotes.hydration}
          validationEnabled={validationEnabled}
          onSelectPreset={selectHydrationPreset}
          onUnlockCustom={unlockCustomHydration}
          onEnterCustom={enterCustomHydration}
        />
      )}

      {validationEnabled && (
        <AdvancedFieldset>
          <SaltField
            saltPercent={salt}
            onChange={changeSalt}
            clampNote={clampNotes.salt}
          />
          <BakeOffLossField
            bakeOffLoss={bakeOffLoss}
            onChange={changeBakeOffLoss}
            clampNote={clampNotes.bakeOffLoss}
          />
          {showSourdoughAdvanced && (
            <>
              <StarterHydrationField
                starterHydration={starterHydration}
                onChange={changeStarterHydration}
                clampNote={clampNotes.starterHydration}
                resetKey={leavingType}
              />
              <DoughTemperatureField
                doughTemperature={doughTemperature}
                onChange={changeDoughTemperature}
                clampNote={clampNotes.doughTemperature}
                resetKey={leavingType}
              />
            </>
          )}
        </AdvancedFieldset>
      )}

      {showFermentationSection && (
        <FermentationSection
          autoRecommendActive={autoRecommendActive}
          bakeTime={bakeTime.bakeTime}
          onChangeBakeTime={bakeTime.changeBakeTime}
          duration={fermentation.duration}
          onChangeDuration={fermentation.changeFermentationDuration}
          durationClamp={fermentation.clampNote}
          validationEnabled={validationEnabled}
          zone={fermentation.zone}
          warning={fermentation.warning}
          effectiveMethod={recommendation.effectiveMethod}
          onOverrideMethod={recommendation.overrideMethod}
          effectiveDurationHours={effectiveDuration}
          doughTemperatureC={doughTemperature}
          hydrationFraction={hydration}
          recommendedPercent={recommendation.recommendedPercent}
          isOverridden={recommendation.isOverridden}
          hasAnyOverride={recommendation.hasAnyOverride}
          onUseRecommended={recommendation.useRecommended}
          resetKey={leavingType}
        />
      )}

      {showYeastBakeTime && (
        <BakeTimeField bakeTime={bakeTime.bakeTime} onChange={bakeTime.changeBakeTime} />
      )}

      <IngredientTable recipe={recipe} loaves={loaves} />

      {bakingScheduleEnabled && <BakingScheduleTable events={schedule} />}
    </section>
  )
}
