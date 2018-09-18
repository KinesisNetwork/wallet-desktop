import { clearNotification, showNotification } from '@actions'
import { RootEpic } from '@store'
import { timer } from 'rxjs'
import { delayWhen, filter, map } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const clearNotifier$: RootEpic = (action$) =>
  action$.pipe(
    filter(isActionOf(showNotification)),
    delayWhen(({payload}) => timer(payload.displayTime || 5000)),
    map(clearNotification)
  )
