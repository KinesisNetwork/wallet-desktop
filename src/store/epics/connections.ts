import { isActionOf } from 'typesafe-actions'
import { of } from 'rxjs/observable/of'
import {
  catchError,
  filter,
  ignoreElements,
  map,
  switchMap,
} from 'rxjs/operators'
import {
  loadConnections,
  loadConnectionsFailure,
  loadConnectionsSuccess,
} from '@actions'
import { fetchConnections } from '@services/connections'
import { generalFailureAlert } from '@helpers/alert'
import { Epic } from '@store'

export const loadConnections$: Epic = (action$) => {
  const loadConnectionsRequest$ = action$.pipe(
    filter(
      isActionOf(loadConnections),
    )
  )

  return loadConnectionsRequest$.pipe(
    switchMap(fetchConnections),
    map(loadConnectionsSuccess),
    catchError((err) => of(loadConnectionsFailure(err))),
  )
}

export const loadConnectionsFailure$: Epic = (action$) => {
  return action$.pipe(
    filter(isActionOf(loadConnectionsFailure)),
    map(() => generalFailureAlert('Unable to load Networks.')),
    ignoreElements(),
  )
}
