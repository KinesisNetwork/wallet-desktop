import {
  tooManyFailedAttempts,
  unlockWalletFailure,
  unlockWalletFailureAlert,
  unlockWalletRequest,
  unlockWalletSuccess
} from '@actions'
import {
  tooManyFailedAttempts$,
  unlockWallet$,
  unlockWalletFailureAlert$,
  walletLockFailure$
} from '../wallets'

import { epicTest } from './helpers'

describe('wallets epic', () => {
  describe('unlock failure', () => {
    it('throws failure alert on failure', async () => {
      const generalFailureAlert = jest.fn(() => Promise.resolve())

      await epicTest({
        epic: unlockWalletFailureAlert$,
        inputActions: [unlockWalletFailureAlert()],
        expectedActions: [],
        dependencies: { generalFailureAlert },
      })

      expect(generalFailureAlert).toHaveBeenCalled()
    })

    it('throws a failure alert on too many failed attempts', async () => {
      const generalFailureAlert = jest.fn(() => Promise.resolve())

      await epicTest({
        epic: tooManyFailedAttempts$,
        inputActions: [tooManyFailedAttempts(new Date())],
        expectedActions: [],
        dependencies: { generalFailureAlert },
      })

      expect(generalFailureAlert).toHaveBeenCalled()
    })
  })
})

describe('unlock wallet request', () => {
  const now = new Date()

  it('sends success action', async () => {
    const decryptedPrivateKey = 'success'
    const publicKey = 'publicKey'
    const password = 'password'

    const decryptPrivateKey = jest.fn(() => decryptedPrivateKey)

    await epicTest({
      epic: unlockWallet$,
      inputActions: [unlockWalletRequest(now)],
      expectedActions: [unlockWalletSuccess({ password, publicKey, decryptedPrivateKey })],
      dependencies: { decryptPrivateKey },
      state: <any>{
        wallets: {
          activeWallet: {
            encryptedPrivateKey: 'jumble',
            publicKey,
            accountName: ''
          },
          failureAttemptTimestamps: [],
          setAccountLocked: {}
        },
        passwords: {
          currentInput: password,
        },
      },
    })

    expect(decryptPrivateKey).toHaveBeenCalled()
    expect(decryptPrivateKey).toHaveBeenCalledWith('jumble', password)
  })

  it('sends failure action', async () => {
    const decryptPrivateKey = jest.fn(() => '')

    await epicTest({
      epic: unlockWallet$,
      inputActions: [unlockWalletRequest(now)],
      dependencies: { decryptPrivateKey },
      expectedActions: [unlockWalletFailure({ now, maxAttempts: 10 })],
      state: <any>{
        wallets: {
          activeWallet: {
            encryptedPrivateKey: 'jumble',
          },
          failureAttemptTimestamps: [],
          setAccountLocked: {}
        },
        passwords: {
          currentInput: 'password',
        },
      },
    })

    expect(decryptPrivateKey).toHaveBeenCalledWith('jumble', 'password')
  })

  it('sends TOO_MANY_FAILED_ATTEMPTS action if within the lock time', async () => {
    await epicTest({
      epic: unlockWallet$,
      inputActions: [unlockWalletRequest(now)],
      dependencies: {},
      expectedActions: [tooManyFailedAttempts(now)],
      state: {
        wallets: <any>{
          activeWallet: {
            encryptedPrivateKey: 'jumble',
          },
          failureAttemptTimestamps: [],
          setAccountLocked: {
            unlockTimestamp: now.valueOf() + 150000
          }
        },
        passwords: {
          currentInput: 'password',
        },
      },
    })
  })
})

describe('walletLockFailure$', () => {
  const now = new Date()

  it('calls TOO_MANY_FAILED_ATTEMPS action when more attempts have been made than allowed', async () => {
    const maxAttempts = 5

    await epicTest({
      epic: walletLockFailure$,
      inputActions: [unlockWalletFailure({ now, maxAttempts })],
      dependencies: {},
      expectedActions: [tooManyFailedAttempts(now)],
      state: {
        wallets: {
          failureAttemptTimestamps: [1, 2, 3, 4, 5, now],
        },
      },
    })
  })

  it('calls UNLOCK_WALLET_FAILURE_ALERT action when no more attempts have been made than allowed', async () => {
    const maxAttempts = 5

    await epicTest({
      epic: walletLockFailure$,
      inputActions: [unlockWalletFailure({ now, maxAttempts })],
      dependencies: {},
      expectedActions: [unlockWalletFailureAlert()],
      state: {
        wallets: {
          failureAttemptTimestamps: [1, 2, 3, 4, now],
        },
      },
    })
  })
})
