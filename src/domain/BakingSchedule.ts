export type ScheduleEvent = {
  readonly name: string
  readonly time: Date
}

const STARTER_FEED_BEFORE_MIX_MIN = 600 // 10h
const PREHEAT_MIN = 45
const TEMPERING_MIN = 30
const BAKE_MIN = 45
const COOL_MIN = 30

function offsetMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

export interface BakingSchedule {
  readonly events: ScheduleEvent[]
}

export class ColdRetardSchedule implements BakingSchedule {
  constructor(
    readonly bakeTime: Date,
    readonly bulkHours: number,
    readonly totalHours: number,
  ) {}

  get events(): ScheduleEvent[] {
    const mixTime = offsetMinutes(this.bakeTime, -this.totalHours * 60)
    const feedTime = offsetMinutes(mixTime, -STARTER_FEED_BEFORE_MIX_MIN)
    const shapeTime = offsetMinutes(mixTime, this.bulkHours * 60)
    const removeTime = offsetMinutes(this.bakeTime, -(TEMPERING_MIN + PREHEAT_MIN))
    const preheatTime = offsetMinutes(this.bakeTime, -PREHEAT_MIN)
    const outOfOven = offsetMinutes(this.bakeTime, BAKE_MIN)
    const readyToEat = offsetMinutes(this.bakeTime, BAKE_MIN + COOL_MIN)

    return [
      { name: 'Feed your starter', time: feedTime },
      { name: 'Mix & bulk fermentation', time: mixTime },
      { name: 'Shape & refrigerate', time: shapeTime },
      { name: 'Cold retard begins', time: shapeTime },
      { name: 'Remove from fridge', time: removeTime },
      { name: 'Preheat oven', time: preheatTime },
      { name: 'Bake', time: this.bakeTime },
      { name: 'Out of oven', time: outOfOven },
      { name: 'Ready to eat', time: readyToEat },
    ]
  }
}

const YEAST_FIRST_RISE_MIN = 90
const YEAST_TOTAL_PREBAKE_MIN = 285 // 4h 45m

export class YeastSchedule implements BakingSchedule {
  constructor(readonly bakeTime: Date) {}

  get events(): ScheduleEvent[] {
    const mixTime = offsetMinutes(this.bakeTime, -YEAST_TOTAL_PREBAKE_MIN)
    const shapeTime = offsetMinutes(mixTime, YEAST_FIRST_RISE_MIN)
    const preheatTime = offsetMinutes(this.bakeTime, -PREHEAT_MIN)
    const outOfOven = offsetMinutes(this.bakeTime, BAKE_MIN)
    const readyToEat = offsetMinutes(this.bakeTime, BAKE_MIN + COOL_MIN)

    return [
      { name: 'Mix dough', time: mixTime },
      { name: 'First rise', time: mixTime },
      { name: 'Shape', time: shapeTime },
      { name: 'Second rise', time: shapeTime },
      { name: 'Preheat oven', time: preheatTime },
      { name: 'Bake', time: this.bakeTime },
      { name: 'Out of oven', time: outOfOven },
      { name: 'Ready to eat', time: readyToEat },
    ]
  }
}

export class SameDaySchedule implements BakingSchedule {
  constructor(
    readonly bakeTime: Date,
    readonly bulkHours: number,
  ) {}

  get events(): ScheduleEvent[] {
    const mixTime = offsetMinutes(this.bakeTime, -this.bulkHours * 60)
    const feedTime = offsetMinutes(mixTime, -STARTER_FEED_BEFORE_MIX_MIN)
    const shapeTime = offsetMinutes(mixTime, this.bulkHours * 60)
    const preheatTime = offsetMinutes(this.bakeTime, -PREHEAT_MIN)
    const outOfOven = offsetMinutes(this.bakeTime, BAKE_MIN)
    const readyToEat = offsetMinutes(this.bakeTime, BAKE_MIN + COOL_MIN)

    return [
      { name: 'Feed your starter', time: feedTime },
      { name: 'Mix & bulk fermentation', time: mixTime },
      { name: 'Shape', time: shapeTime },
      { name: 'Preheat oven', time: preheatTime },
      { name: 'Bake', time: this.bakeTime },
      { name: 'Out of oven', time: outOfOven },
      { name: 'Ready to eat', time: readyToEat },
    ]
  }
}
