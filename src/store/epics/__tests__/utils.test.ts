import { failureAttemptHandler } from '../utils'

describe('#failureAttemptHandler', () => {
  it('returns true for afterLockInTime if the last timestamp was created more than 5 minutes ago', () => {
    const now = Date.now()
    const lastDate = now - 6 * 60 * 1000
    const timestamps = [1, 2, lastDate]

    const result = failureAttemptHandler(timestamps, now)

    expect(result.afterLockInTime).toEqual(true)
    expect(result.withinLockInTime).toEqual(false)
  })

  it('should return true for withinLockInTime if timestamp has at least 10 entries and last timestamp is within 5 minutes', () => {
    const now = Date.now()
    const lastDate = now - 3 * 60 * 1000
    const timestamps = [1, 2, 3, 4, 5, 6, 7, 8, 9, lastDate]

    const result = failureAttemptHandler(timestamps, now)

    expect(result.afterLockInTime).toEqual(false)
    expect(result.withinLockInTime).toEqual(true)
  })
})
