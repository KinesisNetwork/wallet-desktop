import { Epic } from '@store';
import { filter, map, mergeMap, withLatestFrom, catchError } from 'rxjs/operators';
import { fromPromise } from 'rxjs/observable/fromPromise'
import { isActionOf } from 'typesafe-actions';
import { transferRequest, transferSuccess, transferFailed, accountLoadRequest } from '@actions';
import { transferKinesis } from '@services/transfer';
import { of } from 'rxjs';

export const transferRequest$: Epic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(transferRequest)),
    map(({payload}) => payload),
    withLatestFrom(state$),
    mergeMap(
      ([request, state]) => {
        const sourceWallet = state.wallets.walletList[state.wallets.currentlySelected]
        const connection = state.connections.currentConnection
        return fromPromise(transferKinesis(sourceWallet, connection, request))
          .pipe(
            map(() => transferSuccess(sourceWallet.publicKey)),
            catchError((err) => of(transferFailed(err)))
          )
      }
    )
  )

export const transferSuccess$: Epic = (action$) =>
  action$.pipe(
    filter(isActionOf(transferSuccess)),
    map(({payload}) => accountLoadRequest(payload))
  )
