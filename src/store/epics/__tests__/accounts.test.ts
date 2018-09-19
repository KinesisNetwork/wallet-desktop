import { ActionsObservable } from 'redux-observable'
import { of } from 'rxjs/observable/of'
import { toArray } from 'rxjs/operators'

import { accountLoadRequest } from '@actions'
import { loadAccount$ } from '../accounts'
import { epicTest } from './helpers'

describe('Accounts epic', () => {
  describe('loadAccount$', () => {
    const account = 'account'
    const connection = 'connection'
    const error = 'error'
    const publicKey = 'public key'
    const connectionState = {}
    const store$: any = of(connectionState)

    const action$ = ActionsObservable.from([accountLoadRequest(publicKey)])

    it('success', async () => {
      const loadAccount = jest.fn(() => Promise.resolve(account))
      const getCurrentConnection = jest.fn()
      const getTransactions = jest.fn(() => Promise.resolve([]))

      await epicTest({
        epic: loadAccount$,
        inputActions: [accountLoadRequest(publicKey)],
        state: {
          router: { location: { pathname: '/dashboard' } },
          connections: {},
        },
        dependencies: { loadAccount, getCurrentConnection, getTransactions },
      })
    })

    it('failure', async () => {
      const getCurrentConnection = jest.fn(() => connection)
      const loadAccount = jest.fn(() => Promise.reject(error))
      const getTransactions = jest.fn(() => Promise.resolve([]))

      await epicTest({
        epic: loadAccount$,
        inputActions: [accountLoadRequest(publicKey)],
        state: {
          router: { location: { pathname: '/dashboard' } },
          connections: {},
        },
        dependencies: { loadAccount, getCurrentConnection, getTransactions },
      })
    })
  })
})
