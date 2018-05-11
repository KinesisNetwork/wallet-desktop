import { addConnection } from '@actions'
import { saveConnections } from '@services/connections'
import { Epic } from '@store'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { filter, ignoreElements, map, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const saveConnections$: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(addConnection)),
    withLatestFrom(state$),
    map(([, state]) => fromPromise(saveConnections(state.connections.connectionList))),
    ignoreElements(),
  )
