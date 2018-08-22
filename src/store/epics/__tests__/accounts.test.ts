import { ActionsObservable } from 'redux-observable'
import { of } from 'rxjs/observable/of'
import { toArray } from 'rxjs/operators'
import { getType } from 'typesafe-actions'

import {
  accountIsLoading,
  accountLoadFailure,
  accountLoadRequest,
  accountLoadSuccess,
} from '@actions/accounts'
import { loadAccountTransactions } from '@actions/transactions'
import { loadAccount$ } from '../accounts'

describe('Accounts epic', () => {
  describe('loadAccount$', () => {
    const account = 'account'
    const connection = 'connection'
    const error = 'error'
    const publicKey = 'public key'
    const connectionState = {
      connections: {
        currentConnection: connection,
      },
    }
    const store$: any = of(connectionState)

    const action$ = ActionsObservable.from([
      accountLoadRequest(publicKey),
    ])

    it('success', (done) => {
      const expectedOutputActions = [
        { type: getType(accountIsLoading) },
        { type: getType(loadAccountTransactions), payload: publicKey },
        { type: getType(accountLoadSuccess), payload: account },
      ]

      const getCurrentConnection = jest.fn(() => connection)
      const withPolling = jest.fn(() => x => x)
      const loadAccount = jest.fn(() => Promise.resolve(account))

      loadAccount$(action$, store$, { getCurrentConnection, loadAccount, withPolling } as any)
        .pipe(toArray())
        .subscribe((actions) => {
          expect(actions).toEqual(expectedOutputActions)
          expect(withPolling).toHaveBeenCalledWith(350, 20000)
          expect(getCurrentConnection).toHaveBeenCalledWith(connectionState)
          expect(loadAccount).toHaveBeenCalledWith(publicKey, connection)
          done()
        })
    })

   it('failure', (done) => {
      const expectedOutputActions = [
        { type: getType(accountIsLoading) },
        { type: getType(loadAccountTransactions), payload: publicKey },
        { type: getType(accountLoadFailure), payload: error },
      ]

      const getCurrentConnection = jest.fn(() => connection)
      const withPolling = jest.fn(() => x => x)
      const loadAccount = jest.fn(() => Promise.reject(error))

      loadAccount$(action$, store$, { getCurrentConnection, loadAccount, withPolling } as any)
        .pipe(toArray())
        .subscribe((actions) => {
          expect(actions).toEqual(expectedOutputActions)
          expect(withPolling).toHaveBeenCalledWith(350, 20000)
          expect(getCurrentConnection).toHaveBeenCalledWith(connectionState)
          expect(loadAccount).toHaveBeenCalledWith(publicKey, connection)
          done()
        })
    })
  })

})
