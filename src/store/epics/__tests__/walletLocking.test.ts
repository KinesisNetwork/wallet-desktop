import { login, tooManyFailedAttempts, unlockWalletFailure, unlockWalletRequest } from '@actions'
import { unlockWallet$, walletLockFailure$ } from '../walletLocking'

import { epicTest } from './helpers'

jest.mock('../../../services/analytics', () => ({ sendAnalytics: () => null }))

describe('unlock wallet request', () => {
  const now = new Date()
  it('sends success action', async () => {
    const decryptedPrivateKey = 'success'
    const password = 'password'

    const decryptWithPassword = jest.fn(() => decryptedPrivateKey)

    await epicTest({
      epic: unlockWallet$,
      inputActions: [unlockWalletRequest(now)],
      expectedActions: [login({ password })],
      dependencies: { decryptWithPassword },
      state: {
        login: {
          input: {
            currentInput: password,
          },
        },
        wallet: {
          persisted: {
            activeAccount: 0,
            encryptedPassphrase: 'jumble',
            failureAttemptTimestamps: [],
            setAccountLocked: {},
          },
        },
      },
    })

    expect(decryptWithPassword).toHaveBeenCalled()
    expect(decryptWithPassword).toHaveBeenCalledWith('jumble', password)
  })

  it('sends failure action', async () => {
    const decryptWithPassword = jest.fn(() => '')

    await epicTest({
      epic: unlockWallet$,
      inputActions: [unlockWalletRequest(now)],
      dependencies: { decryptWithPassword },
      expectedActions: [unlockWalletFailure({ now, maxAttempts: 10 })],
      state: {
        login: {
          input: {
            currentInput: 'password',
          },
        },
        wallet: {
          persisted: {
            encryptedPassphrase: 'jumble',
            failureAttemptTimestamps: [],
            setAccountLocked: {},
          },
        },
      },
    })

    expect(decryptWithPassword).toHaveBeenCalledWith('jumble', 'password')
  })

  it('sends TOO_MANY_FAILED_ATTEMPTS action if within the lock time', async () => {
    await epicTest({
      epic: unlockWallet$,
      inputActions: [unlockWalletRequest(now)],
      dependencies: {},
      expectedActions: [tooManyFailedAttempts(now)],
      state: {
        login: {
          input: {
            currentInput: 'password',
          },
        },
        wallet: {
          persisted: {
            encryptedPassphrase: 'jumble',
            failureAttemptTimestamps: [],
            setAccountLocked: {
              unlockTimestamp: now.valueOf() + 150000,
            },
          },
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
        wallet: {
          persisted: {
            failureAttemptTimestamps: [1, 2, 3, 4, 5, now],
          },
        },
      },
    })
  })
})
