import { pipe } from 'rxjs'
import { timer } from 'rxjs/observable/timer'
import { mapTo, switchMap } from 'rxjs/operators'

export const withPolling = (delay: number, interval?: number) =>
  pipe(switchMap(action => timer(delay, interval).pipe(mapTo(action))))
