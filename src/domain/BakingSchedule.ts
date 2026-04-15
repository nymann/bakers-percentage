import type { LeavingType } from './SourdoughRecipe'
import type { FermentationMethod } from './StarterRecommendation'
import { bulkHours } from './StarterRecommendation'

export type ScheduleEvent = {
  readonly name: string
  readonly time: Date
}

export type ScheduleConfig = {
  readonly bakeTime: Date
  readonly leavingType: LeavingType
  readonly doughTempC: number
  readonly fermentationMethod: FermentationMethod
  readonly totalHours: number
}

const STARTER_FEED_BEFORE_MIX_MIN = 600 // 10h
const PREHEAT_MIN = 45
const TEMPERING_MIN = 30
const BAKE_MIN = 45
const COOL_MIN = 30

function offsetMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

function coldRetardSchedule(config: ScheduleConfig): ScheduleEvent[] {
  const bulk = bulkHours(config.doughTempC)
  const mixTime = offsetMinutes(config.bakeTime, -config.totalHours * 60)
  const feedTime = offsetMinutes(mixTime, -STARTER_FEED_BEFORE_MIX_MIN)
  const shapeTime = offsetMinutes(mixTime, bulk * 60)
  const removeTime = offsetMinutes(config.bakeTime, -(TEMPERING_MIN + PREHEAT_MIN))
  const preheatTime = offsetMinutes(config.bakeTime, -PREHEAT_MIN)
  const outOfOven = offsetMinutes(config.bakeTime, BAKE_MIN)
  const readyToEat = offsetMinutes(config.bakeTime, BAKE_MIN + COOL_MIN)

  return [
    { name: 'Feed your starter', time: feedTime },
    { name: 'Mix & bulk fermentation', time: mixTime },
    { name: 'Shape & refrigerate', time: shapeTime },
    { name: 'Cold retard begins', time: shapeTime },
    { name: 'Remove from fridge', time: removeTime },
    { name: 'Preheat oven', time: preheatTime },
    { name: 'Bake', time: config.bakeTime },
    { name: 'Out of oven', time: outOfOven },
    { name: 'Ready to eat', time: readyToEat },
  ]
}

const YEAST_FIRST_RISE_MIN = 90
const YEAST_TOTAL_PREBAKE_MIN = 285 // 4h 45m

function yeastSchedule(config: ScheduleConfig): ScheduleEvent[] {
  const mixTime = offsetMinutes(config.bakeTime, -YEAST_TOTAL_PREBAKE_MIN)
  const shapeTime = offsetMinutes(mixTime, YEAST_FIRST_RISE_MIN)
  const preheatTime = offsetMinutes(config.bakeTime, -PREHEAT_MIN)
  const outOfOven = offsetMinutes(config.bakeTime, BAKE_MIN)
  const readyToEat = offsetMinutes(config.bakeTime, BAKE_MIN + COOL_MIN)

  return [
    { name: 'Mix dough', time: mixTime },
    { name: 'First rise', time: mixTime },
    { name: 'Shape', time: shapeTime },
    { name: 'Second rise', time: shapeTime },
    { name: 'Preheat oven', time: preheatTime },
    { name: 'Bake', time: config.bakeTime },
    { name: 'Out of oven', time: outOfOven },
    { name: 'Ready to eat', time: readyToEat },
  ]
}

function sameDaySchedule(config: ScheduleConfig): ScheduleEvent[] {
  const bulk = bulkHours(config.doughTempC)
  const mixTime = offsetMinutes(config.bakeTime, -bulk * 60)
  const feedTime = offsetMinutes(mixTime, -STARTER_FEED_BEFORE_MIX_MIN)
  const shapeTime = offsetMinutes(mixTime, bulk * 60)
  const preheatTime = offsetMinutes(config.bakeTime, -PREHEAT_MIN)
  const outOfOven = offsetMinutes(config.bakeTime, BAKE_MIN)
  const readyToEat = offsetMinutes(config.bakeTime, BAKE_MIN + COOL_MIN)

  return [
    { name: 'Feed your starter', time: feedTime },
    { name: 'Mix & bulk fermentation', time: mixTime },
    { name: 'Shape', time: shapeTime },
    { name: 'Preheat oven', time: preheatTime },
    { name: 'Bake', time: config.bakeTime },
    { name: 'Out of oven', time: outOfOven },
    { name: 'Ready to eat', time: readyToEat },
  ]
}

export function generateSchedule(config: ScheduleConfig): ScheduleEvent[] {
  if (config.leavingType === 'sourdough' && config.fermentationMethod === 'cold-retard') {
    return coldRetardSchedule(config)
  }
  if (config.leavingType === 'sourdough') {
    return sameDaySchedule(config)
  }
  return yeastSchedule(config)
}
