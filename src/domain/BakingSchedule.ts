export type ScheduleEvent = {
  readonly name: string
  readonly time: Date
}

const STARTER_FEED_BEFORE_MIX_MIN = 600 // 10h
const SHAPE_MIN = 30
const TEMPERING_MIN = 30

function offsetMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

export interface BakingSchedule {
  readonly events: ScheduleEvent[]
}

export interface ColdRetardScheduleOptions {
  readonly includeStarterFeed?: boolean
}

export class ColdRetardSchedule implements BakingSchedule {
  readonly bakeTime: Date
  readonly bulkHours: number
  readonly totalHours: number
  readonly includeStarterFeed: boolean

  constructor(
    bakeTime: Date,
    bulkHours: number,
    totalHours: number,
    options: ColdRetardScheduleOptions = {},
  ) {
    this.bakeTime = bakeTime
    this.bulkHours = bulkHours
    this.totalHours = totalHours
    this.includeStarterFeed = options.includeStarterFeed ?? true
  }

  get events(): ScheduleEvent[] {
    const mixTime = offsetMinutes(this.bakeTime, -this.totalHours * 60)
    const feedTime = offsetMinutes(mixTime, -STARTER_FEED_BEFORE_MIX_MIN)
    const shapeTime = offsetMinutes(mixTime, this.bulkHours * 60)
    const refrigerateTime = offsetMinutes(shapeTime, SHAPE_MIN)
    const removeTime = offsetMinutes(this.bakeTime, -TEMPERING_MIN)

    const events: ScheduleEvent[] = []
    if (this.includeStarterFeed) {
      events.push({ name: 'Feed your starter', time: feedTime })
    }
    events.push(
      { name: 'Mix & bulk fermentation', time: mixTime },
      { name: 'Shape', time: shapeTime },
      { name: 'Refrigerate', time: refrigerateTime },
      { name: 'Remove from fridge', time: removeTime },
      { name: 'Bake', time: this.bakeTime },
    )
    return events
  }
}

const YEAST_FIRST_RISE_MIN = 90
const YEAST_TOTAL_PREBAKE_MIN = 285 // 4h 45m

export class YeastSchedule implements BakingSchedule {
  readonly bakeTime: Date

  constructor(bakeTime: Date) {
    this.bakeTime = bakeTime
  }

  get events(): ScheduleEvent[] {
    const mixTime = offsetMinutes(this.bakeTime, -YEAST_TOTAL_PREBAKE_MIN)
    const shapeTime = offsetMinutes(mixTime, YEAST_FIRST_RISE_MIN)

    return [
      { name: 'Mix dough', time: mixTime },
      { name: 'First rise', time: mixTime },
      { name: 'Shape', time: shapeTime },
      { name: 'Second rise', time: shapeTime },
      { name: 'Bake', time: this.bakeTime },
    ]
  }
}

export class SameDaySchedule implements BakingSchedule {
  readonly bakeTime: Date
  readonly bulkHours: number

  constructor(bakeTime: Date, bulkHours: number) {
    this.bakeTime = bakeTime
    this.bulkHours = bulkHours
  }

  get events(): ScheduleEvent[] {
    const mixTime = offsetMinutes(this.bakeTime, -this.bulkHours * 60)
    const feedTime = offsetMinutes(mixTime, -STARTER_FEED_BEFORE_MIX_MIN)
    const shapeTime = offsetMinutes(mixTime, this.bulkHours * 60)

    return [
      { name: 'Feed your starter', time: feedTime },
      { name: 'Mix & bulk fermentation', time: mixTime },
      { name: 'Shape', time: shapeTime },
      { name: 'Bake', time: this.bakeTime },
    ]
  }
}
