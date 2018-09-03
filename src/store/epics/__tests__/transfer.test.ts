import { Transaction } from 'js-kinesis-sdk'
import { ActionsObservable, StateObservable } from 'redux-observable'
import { of } from 'rxjs/observable/of'
import { toArray } from 'rxjs/operators'
import { getType } from 'typesafe-actions'

import {
  accountLoadRequest,
  transactionFailed,
  transactionRequest,
  transactionSuccess,
  transferRequest,
} from '@actions'
import { RootState } from '@store'
import { Connection, ConnectionStage, Currency } from '@types'
import { DeepPartial } from 'redux'
import { ConnectionsState } from '../../reducers'
import {
  transactionFailed$,
  transactionSubmission$,
  transactionSuccess$,
  transferRequest$,
} from '../transfer'
import { epicTest, mockServices } from './helpers'

describe('Transfer epic', () => {
  const connection: Connection = {
    endpoint: 'endpoint',
    passphrase: 'passphrase',
  }
  const connections: DeepPartial<ConnectionsState> = {
    currentCurrency: Currency.KAU,
    currentStage: ConnectionStage.testnet,
    connections: {
      testnet: {
        KAU: connection,
      },
    },
  }
  const payee = 'payee'
  const amount = 'amount'
  const memo = 'memo'
  const publicKey = 'public key'
  const privateKey = 'private key'
  const transferPayload = {
    amount,
    memo,
    targetPayee: payee,
  }
  const wallet = {
    publicKey,
  }

  const store = {
    connections,
    passwords: {
      livePasswords: {
        [wallet.publicKey]: {
          privateKey,
        },
      },
    },
    wallets: {
      activeWallet: wallet,
    },
  }

  describe('transferRequest$', () => {
    const action$ = ActionsObservable.from([transferRequest(transferPayload)])
    const store$: StateObservable<RootState> = of(store) as any

    const getActiveKeys = jest.fn(() => ({ privateKey }))
    const getCurrentConnection = jest.fn(() => connection)

    it('success', done => {
      const expectedOutputActions = [
        { type: getType(transactionRequest), payload: transferPayload },
      ]

      const createKinesisTransfer = jest.fn(() => Promise.resolve(transferPayload))

      transferRequest$(
        action$,
        store$,
        mockServices({ createKinesisTransfer, getActiveKeys, getCurrentConnection }),
      )
        .pipe(toArray())
        .subscribe(actions => {
          expect(actions).toEqual(expectedOutputActions)
          expect(getActiveKeys).toHaveBeenCalledWith(store)
          expect(getCurrentConnection).toHaveBeenCalledWith(store.connections)
          expect(createKinesisTransfer).toHaveBeenCalledWith(
            privateKey,
            connection,
            transferPayload,
          )
          done()
        })
    })

    it('failure', done => {
      const error = 'error'

      const expectedOutputActions = [{ type: getType(transactionFailed), payload: error }]

      const createKinesisTransfer = jest.fn(() => Promise.reject(error))

      transferRequest$(
        action$,
        store$,
        mockServices({ createKinesisTransfer, getActiveKeys, getCurrentConnection }),
      )
        .pipe(toArray())
        .subscribe(actions => {
          expect(actions).toEqual(expectedOutputActions)
          expect(getActiveKeys).toHaveBeenCalledWith(store)
          expect(getCurrentConnection).toHaveBeenCalledWith(store.connections)
          expect(createKinesisTransfer).toHaveBeenCalledWith(
            privateKey,
            connection,
            transferPayload,
          )
          done()
        })
    })
  })

  describe('transactionSubmission$', () => {
    const transaction = <Transaction>(<any>{})
    it('success', async () => {
      const getCurrentConnection = jest.fn(() => connection)
      const submitSignedTransaction = jest.fn(() => Promise.resolve())

      await epicTest({
        epic: transactionSubmission$,
        inputActions: [transactionRequest(transaction)],
        state: { connections },
        dependencies: { getCurrentConnection, submitSignedTransaction },
      })
      expect(getCurrentConnection).toHaveBeenCalledWith(connections)
      expect(submitSignedTransaction).toHaveBeenCalledWith(connection, transaction)
    })

    it('failure', async () => {
      const error = new Error('error')
      const getCurrentConnection = jest.fn(() => connection)
      const submitSignedTransaction = jest.fn(() => Promise.reject(error))

      await epicTest({
        epic: transactionSubmission$,
        inputActions: [transactionRequest(transaction)],
        expectedActions: [transactionFailed(error)],
        state: { connections },
        dependencies: { getCurrentConnection, submitSignedTransaction },
      })
      expect(getCurrentConnection).toHaveBeenCalledWith(connections)
      expect(submitSignedTransaction).toHaveBeenCalledWith(connection, transaction)
    })
  })

  describe('transactionSuccess$', () => {
    const store$ = <StateObservable<RootState>>(<any>of(store))
    const action$ = ActionsObservable.from([transactionSuccess()])

    it('success', done => {
      const expectedOutputActions = [{ type: getType(accountLoadRequest), payload: publicKey }]

      const generalSuccessAlert = jest.fn(() => Promise.resolve())
      const getActiveKeys = jest.fn(() => ({ publicKey }))

      transactionSuccess$(action$, store$, mockServices({ generalSuccessAlert, getActiveKeys }))
        .pipe(toArray())
        .subscribe(actions => {
          expect(actions).toEqual(expectedOutputActions)
          expect(generalSuccessAlert).toHaveBeenCalledWith('The transfer was successful.')
          expect(getActiveKeys).toHaveBeenCalledWith(store)
          done()
        })
    })
  })

  describe('transactionFailed$', () => {
    const errorMessage = 'errorMessage'
    const error = <Error>(<any>'error')

    const action$ = ActionsObservable.from([transactionFailed(error)])

    it('failure', done => {
      const expectedOutputActions = []
      const state$ = <StateObservable<RootState>>(<any>of({}))

      const getTransactionErrorMessage = jest.fn(() => errorMessage)
      const generalFailureAlert = jest.fn(() => Promise.resolve())

      transactionFailed$(
        action$,
        state$,
        mockServices({ generalFailureAlert, getTransactionErrorMessage }),
      )
        .pipe(toArray())
        .subscribe(actions => {
          expect(actions).toEqual(expectedOutputActions)
          expect(getTransactionErrorMessage).toHaveBeenCalledWith(error)
          expect(generalFailureAlert).toHaveBeenCalledWith(errorMessage)
          done()
        })
    })
  })
})
