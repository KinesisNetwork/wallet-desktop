import {
  clearWalletFailures,
  tooManyFailuresMessage,
  unlockWalletFailure,
  unlockWalletRequest,
  unlockWalletSuccess
} from '@actions'
import {
  tooManyFailuresMessage$,
  unlockWallet$,
  walletLockFailure$
} from '../wallets'

import { epicTest } from './helpers'

describe('wallets epic', () => {
  describe('unlock failure', () => {
    it('throws failure alert on failure', async () => {
      const generalFailureAlert = jest.fn(() => Promise.resolve())
      const dateNow = Date.now()
      jest.spyOn(Date, 'now').mockImplementation(() => dateNow)

      await epicTest({
        epic: walletLockFailure$,
        inputActions: [unlockWalletFailure(dateNow)],
        expectedActions: [],
        dependencies: { generalFailureAlert },
      })

      expect(generalFailureAlert).toHaveBeenCalled()
      jest.restoreAllMocks()
    })

    it('throws a failure alert on too many failed attempts', async () => {
      const generalFailureAlert = jest.fn(() => Promise.resolve())

      await epicTest({
        epic: tooManyFailuresMessage$,
        inputActions: [tooManyFailuresMessage()],
        expectedActions: [],
        dependencies: { generalFailureAlert },
      })

      expect(generalFailureAlert).toHaveBeenCalled()
    })
  })
})

describe('unlock wallet request', () => {
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
          failureAttemptTimestamps: []
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
    const dateNow = Date.now()
    jest.spyOn(Date, 'now').mockImplementation(() => dateNow)

    await epicTest({
      epic: unlockWallet$,
      inputActions: [unlockWalletRequest()],
      dependencies: { decryptPrivateKey },
      expectedActions: [unlockWalletFailure(Date.now())],
      state: {
        wallets: {
          activeWallet: {
            encryptedPrivateKey: 'jumble',
          },
          failureAttemptTimestamps: []
        },
        passwords: {
          currentInput: 'password',
        },
      },
    })

    expect(decryptPrivateKey).toHaveBeenCalledWith('jumble', 'password')
    jest.restoreAllMocks()
  })

  it('sends CLEAR_WALLET_FAILURES if user waited for more than 5 minutes', async () => {
    const decryptPrivateKey = jest.fn(() => '')

    await epicTest({
      epic: unlockWallet$,
      inputActions: [unlockWalletRequest()],
      dependencies: { decryptPrivateKey },
      expectedActions: [clearWalletFailures()],
      state: {
        wallets: {
          failureAttemptTimestamps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
      },
    })

    expect(decryptPrivateKey).not.toHaveBeenCalled()
  })

  it('sends TOO_MANY_FAILURES_MESSAGE action if user tried at least 10 times in 5 minutes', async () => {
    const decryptPrivateKey = jest.fn(() => '')
    const lastDate = Date.now() - 10000

    await epicTest({
      epic: unlockWallet$,
      inputActions: [unlockWalletRequest()],
      dependencies: {},
      expectedActions: [tooManyFailuresMessage()],
      state: {
        wallets: {
          failureAttemptTimestamps: [1, 2, 3, 4, 5, 6, 7, 8, 9, lastDate]
        },
      },
    })

    expect(decryptPrivateKey).not.toHaveBeenCalled()
  })
})
