import { removePayee, setPayee } from '@actions'
import { savePayees } from '@services/payees'
import { Epic } from '@store'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { filter, ignoreElements, mergeMap, withLatestFrom } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const savePayees$: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(removePayee) || isActionOf(setPayee)),
    withLatestFrom(state$),
    mergeMap(([, state]) => fromPromise(savePayees(state.payees.payees))),
    ignoreElements(),
  )
