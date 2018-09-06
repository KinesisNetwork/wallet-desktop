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
      state: {
        wallets: {
          activeWallet: {
            encryptedPrivateKey: 'jumble',
            publicKey,
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
      expectedActions: [unlockWalletFailure(now)],
      state: {
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
    const decryptPrivateKey = jest.fn(() => '')

    await epicTest({
      epic: unlockWallet$,
      inputActions: [unlockWalletRequest(now)],
      dependencies: {},
      expectedActions: [tooManyFailedAttempts(now)],
      state: {
        wallets: {
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

    expect(decryptPrivateKey).not.toHaveBeenCalled()
  })
})

describe('walletLockFailure$', () => {
  const now = new Date()

  it('calls TOO_MANY_FAILED_ATTEMPS action when more than 10 failed attempts have been made', async () => {
    await epicTest({
      epic: walletLockFailure$,
      inputActions: [unlockWalletFailure(now)],
      dependencies: {},
      expectedActions: [tooManyFailedAttempts(now)],
      state: {
        wallets: {
          failureAttemptTimestamps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, now],
        },
      },
    })
  })

  it('calls UNLOCK_WALLET_FAILURE_ALERT action when max 10 failed attempts have been made', async () => {
    await epicTest({
      epic: walletLockFailure$,
      inputActions: [unlockWalletFailure(now)],
      dependencies: {},
      expectedActions: [unlockWalletFailureAlert()],
      state: {
        wallets: {
          failureAttemptTimestamps: [1, 2, 3, 4, 5, 6, 7, 8, now],
        },
      },
    })
  })
})
