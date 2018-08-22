import { ActionsObservable } from 'redux-observable'
import { of } from 'rxjs/observable/of'
import { toArray } from 'rxjs/operators'
import { getType } from 'typesafe-actions'

import {
  accountTransactionsLoaded,
  loadAccountTransactions,
  loadNextTransactionPage,
} from '@actions/transactions'
import { TransactionOperationView } from '@types'
import { loadNextPage, loadTransactionsForAccount } from '../transactions'

describe('Transactions epic', () => {
  describe('loadTransactionsForAccount', () => {
    const transactions = 'transactions'
    const connection = 'connection'
    const publicKey = 'public key'
    const connectionState = {
      connections: {
        currentConnection: connection,
      },
    }
    const store$: any = of(connectionState)

    const action$ = ActionsObservable.from([
      loadAccountTransactions(publicKey),
    ])

    it('success', (done) => {
      const expectedOutputActions = [
        { type: getType(accountTransactionsLoaded), payload: transactions },
      ]

      const getCurrentConnection = jest.fn(() => connection)
      const withPolling = jest.fn(() => x => x)
      const getTransactions = jest.fn(() => Promise.resolve(transactions))

      loadTransactionsForAccount(action$, store$, { getCurrentConnection, getTransactions, withPolling } as any)
        .pipe(toArray())
        .subscribe((actions) => {
          expect(actions).toEqual(expectedOutputActions)
          expect(withPolling).toHaveBeenCalledWith(350, 20000)
          expect(getCurrentConnection).toHaveBeenCalledWith(connectionState)
          expect(getTransactions).toHaveBeenCalledWith(connection, publicKey)
          done()
        })
    })
  })

  it('loadNextPage', (done) => {
    const transactions = <TransactionOperationView[]><any> 'transactions'
    
    const action$ = ActionsObservable.from([
      accountTransactionsLoaded(transactions),
    ])
    
    const expectedOutputActions = [
      { type: getType(loadNextTransactionPage) },
    ]

    const store$: any = {}
    const deps: any = {}

    loadNextPage(action$, store$, deps)
      .pipe(toArray())
      .subscribe((actions) => {
        expect(actions).toEqual(expectedOutputActions)
        done()
      })
  })
})
