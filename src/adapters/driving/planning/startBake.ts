import type { FermentationMethod } from '../../../domain/Fermentation'
import type { LeavingType } from '../../../domain/SourdoughRecipe'

export type PhasedChecklistLabel = {
  readonly label: string
  readonly phase: string
}

const SOURDOUGH_CHECKLIST: readonly PhasedChecklistLabel[] = [
  { label: 'First fold (initial strength)', phase: 'Mix & bulk fermentation' },
  { label: 'Second fold (lamination)', phase: 'Mix & bulk fermentation' },
  { label: 'Third fold (coil fold)', phase: 'Mix & bulk fermentation' },
  { label: 'Shape the dough', phase: 'Shape' },
  { label: 'Score and bake', phase: 'Bake' },
]

const YEAST_CHECKLIST: readonly PhasedChecklistLabel[] = [
  { label: 'Mix until smooth', phase: 'Mix dough' },
  { label: 'Check gluten development', phase: 'First rise' },
  { label: 'Pre-shape and bench rest', phase: 'Shape' },
  { label: 'Final shape complete', phase: 'Shape' },
  { label: 'Poke test passed', phase: 'Second rise' },
  { label: 'Score and load', phase: 'Bake' },
]

const YEAST_RETARD_CHECKLIST: readonly PhasedChecklistLabel[] = [
  { label: 'Mix until smooth', phase: 'Mix & bulk fermentation' },
  { label: 'Check gluten development', phase: 'Mix & bulk fermentation' },
  { label: 'Pre-shape and bench rest', phase: 'Shape' },
  { label: 'Final shape complete', phase: 'Shape' },
  { label: 'Poke test passed', phase: 'Remove from fridge' },
  { label: 'Score and load', phase: 'Bake' },
]

export function checklistFor(
  method: FermentationMethod,
): readonly PhasedChecklistLabel[] {
  switch (method) {
    case 'same-day':
    case 'cold-retard':
      return SOURDOUGH_CHECKLIST
    case 'yeast':
      return YEAST_CHECKLIST
    case 'yeast-retard':
      return YEAST_RETARD_CHECKLIST
  }
}

export function bakeNameFor(input: {
  readonly leaving: LeavingType
  readonly loaves: number
  readonly finishedWeight: number
}): string {
  const label = input.leaving === 'sourdough' ? 'Sourdough' : 'Yeasted bread'
  const loaves = input.loaves === 1 ? '1 loaf' : `${input.loaves} loaves`
  return `${label} · ${loaves} · ${input.finishedWeight}g`
}
