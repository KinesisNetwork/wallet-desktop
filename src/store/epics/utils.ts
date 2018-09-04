
import { pipe } from 'rxjs'
import { timer } from 'rxjs/observable/timer'
import { mapTo, switchMap } from 'rxjs/operators'

export const withPolling = (delay: number, interval?: number) => pipe(
  switchMap(
    action => timer(delay, interval).pipe(mapTo(action))
  )
)

export const failureAttemptHandler = (timestamps, timeNow) => {
  const LOCK_TIME_IN_MS = 5 * 60 * 1000
  const MAX_ATTEMPTS = 10
  const length = timestamps.length

  return {
    afterLockInTime: timestamps[length - 1] + LOCK_TIME_IN_MS < timeNow,
    withinLockInTime: timestamps[length - 1] + LOCK_TIME_IN_MS >= timeNow && length >= MAX_ATTEMPTS
  }
}
