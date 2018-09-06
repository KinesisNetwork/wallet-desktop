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
  const dateObj = Date

  beforeEach(() => {
    const dateStub = jest.fn(() => Date)
    const _GLOBAL: any = global
    _GLOBAL.Date = dateStub
  })

  afterEach(() => {
    global.Date = dateObj
  })

  it('sends success action', async () => {
    const decryptedPrivateKey = 'success'
    const publicKey = 'publicKey'
    const password = 'password'

    const decryptPrivateKey = jest.fn(() => decryptedPrivateKey)

    await epicTest({
      epic: unlockWallet$,
      inputActions: [unlockWalletRequest()],
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
      inputActions: [unlockWalletRequest()],
      dependencies: { decryptPrivateKey },
      expectedActions: [unlockWalletFailure(new Date())],
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
    const now = new Date()

    await epicTest({
      epic: unlockWallet$,
      inputActions: [unlockWalletRequest()],
      dependencies: {},
      expectedActions: [tooManyFailedAttempts(now)],
      state: {
        wallets: {
          activeWallet: {
            encryptedPrivateKey: 'jumble',
          },
          failureAttemptTimestamps: [],
          setAccountLocked: {
            unlockTimestamp: now.valueOf() + 15000
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
  it('calls TOO_MANY_FAILED_ATTEMPS action when more than 10 failed attempts have been made', async () => {
    await epicTest({
      epic: walletLockFailure$,
      inputActions: [unlockWalletFailure(new Date())],
      dependencies: {},
      expectedActions: [tooManyFailedAttempts(new Date())],
      state: {
        wallets: {
          failureAttemptTimestamps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, new Date()],
        },
      },
    })
  })

  it('calls UNLOCK_WALLET_FAILURE_ALERT action when max 10 failed attempts have been made', async () => {
    await epicTest({
      epic: walletLockFailure$,
      inputActions: [unlockWalletFailure(new Date())],
      dependencies: {},
      expectedActions: [unlockWalletFailureAlert()],
      state: {
        wallets: {
          failureAttemptTimestamps: [1, 2, 3, 4, 5, 6, 7, 8, new Date()],
        },
      },
    })
  })
})
