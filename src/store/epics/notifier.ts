import { pipe, timer } from 'rxjs'
import { filter, map, switchMap } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import { clearNotification, showNotification } from '@actions'
import { RootEpic } from '@store'

export const clearNotifier$: RootEpic = pipe(
  filter(isActionOf(showNotification)),
  map(({ payload }) => payload.displayTime || 5000),
  switchMap(delay => timer(delay).pipe(map(clearNotification))),
)
