import { useCallback, useMemo, useState } from 'react'

export type PlanningWizardStep = 'setup' | 'timing'

export interface PlanningStepIndicatorProps {
  role: 'button'
  type: 'button'
  'aria-current': 'step' | undefined
  'aria-label': string
  tabIndex: 0
  onClick: () => void
}

export interface PlanningPanelProps {
  role: 'region'
  id: string
  'aria-labelledby': string
  hidden: boolean
}

export interface PlanningButtonProps {
  type: 'button'
  onClick: () => void
  'aria-label': string
}

export interface UsePlanningWizard {
  currentStep: PlanningWizardStep
  isSetup: boolean
  isTiming: boolean
  goToSetup: () => void
  goToTiming: () => void
  getStepIndicatorProps: (step: PlanningWizardStep) => PlanningStepIndicatorProps
  getSetupPanelProps: () => PlanningPanelProps
  getTimingPanelProps: () => PlanningPanelProps
  getNextButtonProps: () => PlanningButtonProps
  getBackButtonProps: () => PlanningButtonProps
}

const STEP_LABEL: Record<PlanningWizardStep, string> = {
  setup: 'Step 1: setup',
  timing: 'Step 2: timing',
}

function indicatorId(step: PlanningWizardStep): string {
  return `planning-step-${step}`
}

function panelId(step: PlanningWizardStep): string {
  return `planning-panel-${step}`
}

export function usePlanningWizard(): UsePlanningWizard {
  const [currentStep, setCurrentStep] = useState<PlanningWizardStep>('setup')

  const goToSetup = useCallback(() => setCurrentStep('setup'), [])
  const goToTiming = useCallback(() => setCurrentStep('timing'), [])

  const getStepIndicatorProps = useCallback(
    (step: PlanningWizardStep): PlanningStepIndicatorProps => ({
      role: 'button',
      type: 'button',
      'aria-current': currentStep === step ? 'step' : undefined,
      'aria-label': STEP_LABEL[step],
      tabIndex: 0,
      onClick: () => setCurrentStep(step),
    }),
    [currentStep],
  )

  const getSetupPanelProps = useCallback(
    (): PlanningPanelProps => ({
      role: 'region',
      id: panelId('setup'),
      'aria-labelledby': indicatorId('setup'),
      hidden: currentStep !== 'setup',
    }),
    [currentStep],
  )

  const getTimingPanelProps = useCallback(
    (): PlanningPanelProps => ({
      role: 'region',
      id: panelId('timing'),
      'aria-labelledby': indicatorId('timing'),
      hidden: currentStep !== 'timing',
    }),
    [currentStep],
  )

  const getNextButtonProps = useCallback(
    (): PlanningButtonProps => ({
      type: 'button',
      'aria-label': 'Continue to timing',
      onClick: goToTiming,
    }),
    [goToTiming],
  )

  const getBackButtonProps = useCallback(
    (): PlanningButtonProps => ({
      type: 'button',
      'aria-label': 'Edit setup',
      onClick: goToSetup,
    }),
    [goToSetup],
  )

  return useMemo(
    () => ({
      currentStep,
      isSetup: currentStep === 'setup',
      isTiming: currentStep === 'timing',
      goToSetup,
      goToTiming,
      getStepIndicatorProps,
      getSetupPanelProps,
      getTimingPanelProps,
      getNextButtonProps,
      getBackButtonProps,
    }),
    [
      currentStep,
      goToSetup,
      goToTiming,
      getStepIndicatorProps,
      getSetupPanelProps,
      getTimingPanelProps,
      getNextButtonProps,
      getBackButtonProps,
    ],
  )
}

export const PLANNING_STEP_INDICATOR_ID = indicatorId
