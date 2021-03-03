import { Keypair } from 'js-kinesis-sdk'

import {
  targetPayeeAccountExist,
  targetPayeeAccountNotExist,
  transactionFailed,
  transactionRequest,
  transferRequest,
  updateContactForm,
} from '@actions'
import { Connection, ConnectionStage, Contact, Currency, FormUpdate } from '@types'
import { DeepPartial } from 'redux'
import { ConnectionsState } from '../../reducers'
import {
  checkTargetPayeeAccountExist$,
  transactionSubmission$,
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
    targetPayee: payee,
    fee,
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
    const transaction = <string>(<any>{})
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

  describe('checkTargetPayeeAccountExist$', () => {
    it('should dispatch targetPayeeAccountNotExist if the account does not exist', async () => {
      const getCurrentConnection = jest.fn(() => connection)
      const isValidPublicKey = jest.fn(() => true)
      const loadAccount = jest
        .fn()
        .mockRejectedValue(Error('Account does not exist on the network'))
      const form: FormUpdate<Contact> = {
        field: 'address',
        newValue: 'GBW6WVHUL2SPEAEAI3Y6HFOX7G2ZS2SPDSCDZS6UET6ZRSFZ4NPIMSOP',
      }
      await epicTest({
        epic: checkTargetPayeeAccountExist$,
        inputActions: [updateContactForm(form)],
        state: {
          connections,
        },
        dependencies: { isValidPublicKey, getCurrentConnection, loadAccount },
        expectedActions: [targetPayeeAccountNotExist()],
      })
    })
    it('should dispatch targetPayeeAccountExist if the account does exist', async () => {
      const getCurrentConnection = jest.fn(() => connection)
      const isValidPublicKey = jest.fn(() => true)
      const loadAccount = jest.fn().mockResolvedValue(true)
      const form: FormUpdate<Contact> = {
        field: 'address',
        newValue: 'GBW6WVHUL2SPEAEAI3Y6HFOX7G2ZS2SPDSCDZS6UET6ZRSFZ4NPIMSOP',
      }
      await epicTest({
        epic: checkTargetPayeeAccountExist$,
        inputActions: [updateContactForm(form)],
        state: {
          connections,
        },
        dependencies: { isValidPublicKey, getCurrentConnection, loadAccount },
        expectedActions: [targetPayeeAccountExist()],
      })
    })
  })
})
