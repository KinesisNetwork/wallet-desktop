import { ActionsObservable } from 'redux-observable'
import { of } from 'rxjs/observable/of'
import { toArray } from 'rxjs/operators'

import { accountLoadRequest } from '@actions'
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

    const action$ = ActionsObservable.from([accountLoadRequest(publicKey)])

    it('success', done => {
      const getCurrentConnection = jest.fn(() => connection)
      const loadAccount = jest.fn(() => Promise.resolve(account))

      loadAccount$(action$, store$, { getCurrentConnection, loadAccount } as any)
        .pipe(toArray())
        .subscribe(actions => {
          expect(actions).toEqual([])
          done()
        })
    })

    it('failure', done => {
      const expectedOutputActions = []

      const getCurrentConnection = jest.fn(() => connection)
      const loadAccount = jest.fn(() => Promise.reject(error))

      loadAccount$(action$, store$, { getCurrentConnection, loadAccount } as any)
        .pipe(toArray())
        .subscribe(actions => {
          expect(actions).toEqual(expectedOutputActions)
          done()
        })
    })
  })
})
