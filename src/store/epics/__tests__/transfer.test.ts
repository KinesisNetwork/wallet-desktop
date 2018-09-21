import { Keypair, Transaction } from 'js-kinesis-sdk'

import {
  accountLoadRequest,
  transactionFailed,
  transactionRequest,
  transactionSuccess,
  transferRequest,
} from '@actions'
import { Connection, ConnectionStage, Currency } from '@types'
import { DeepPartial } from 'redux'
import { ConnectionsState } from '../../reducers'
import {
  transactionFailed$,
  transactionSubmission$,
  transactionSuccess$,
  transferRequest$,
} from '../transfer'
import { epicTest } from './helpers'

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
  const fee = 'fee'
  const transferPayload = {
    amount,
    memo,
    payeePublicKey: payee,
    fee
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
    const getCurrentConnection = jest.fn(() => connection)

    it('success', async () => {
      const keypair = Keypair.random()
      const createKinesisTransfer = jest.fn(() => Promise.resolve(transferPayload))
      await epicTest({
        epic: transferRequest$,
        inputActions: [transferRequest(transferPayload)],
        state: {
          connections,
          wallet: {
            accounts: [{ keypair }],
            persisted: {
              activeAccount: 0,
            },
          },
        },
        dependencies: { createKinesisTransfer, getCurrentConnection },
      })
      expect(getCurrentConnection).toHaveBeenCalledWith(store.connections)
      expect(createKinesisTransfer).toHaveBeenCalledWith(
        keypair.secret(),
        connection,
        transferPayload,
      )
    })

    it('failure', async () => {
      const keypair = Keypair.random()
      const error = new Error()
      const createKinesisTransfer = jest.fn(() => Promise.reject(error))
      await epicTest({
        epic: transferRequest$,
        inputActions: [transferRequest(transferPayload)],
        expectedActions: [transactionFailed(error)],
        dependencies: { createKinesisTransfer, getCurrentConnection },
        state: {
          connections,
          wallet: {
            accounts: [{ keypair }],
            persisted: {
              activeAccount: 0,
            },
          },
        },
      })
      expect(getCurrentConnection).toHaveBeenCalledWith(store.connections)
      expect(createKinesisTransfer).toHaveBeenCalledWith(
        keypair.secret(),
        connection,
        transferPayload,
      )
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
    it('success', async () => {
      const generalSuccessAlert = jest.fn(() => Promise.resolve())
      const keypair = Keypair.random()

      await epicTest({
        epic: transactionSuccess$,
        inputActions: [transactionSuccess()],
        state: {
          wallet: {
            accounts: [{ keypair }],
            persisted: {
              activeAccount: 0,
            },
          },
        },
        dependencies: { generalSuccessAlert },
        expectedActions: [accountLoadRequest(keypair.publicKey())],
      })

      expect(generalSuccessAlert).toHaveBeenCalledWith('The transfer was successful.')
    })
  })

  describe('transactionFailed$', () => {
    const errorMessage = 'errorMessage'
    const error = <Error>(<any>'error')

    it('failure', async () => {
      const getTransactionErrorMessage = jest.fn(() => errorMessage)
      const generalFailureAlert = jest.fn(() => Promise.resolve())

      await epicTest({
        epic: transactionFailed$,
        inputActions: [transactionFailed(error)],
        dependencies: { generalFailureAlert, getTransactionErrorMessage },
      })

      expect(getTransactionErrorMessage).toHaveBeenCalledWith(error)
      expect(generalFailureAlert).toHaveBeenCalledWith(errorMessage)
    })
  })
})
