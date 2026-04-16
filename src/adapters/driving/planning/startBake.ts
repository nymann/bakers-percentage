import type { LeavingType } from '../../../domain/SourdoughRecipe'

const SOURDOUGH_CHECKLIST: readonly string[] = [
  'First fold (initial strength)',
  'Second fold (lamination)',
  'Third fold (coil fold)',
  'Shape the dough',
  'Score and bake',
]

const YEAST_CHECKLIST: readonly string[] = [
  'Mix complete',
  'First rise',
  'Shape',
  'Second rise',
  'Score and bake',
]

export function checklistForLeavening(
  leaving: LeavingType,
): readonly string[] {
  return leaving === 'sourdough' ? SOURDOUGH_CHECKLIST : YEAST_CHECKLIST
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
