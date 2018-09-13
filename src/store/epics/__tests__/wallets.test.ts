import { login, tooManyFailedAttempts, unlockWalletFailure, unlockWalletRequest } from '@actions'
import { unlockWallet$, walletLockFailure$ } from '../walletLocking'

import { epicTest } from './helpers'

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
        wallets: {
          failureAttemptTimestamps: [],
          setAccountLocked: {},
        },
        wallet: {
          persisted: {
            activeAccount: 0,
            encryptedPassphrase: 'jumble',
          },
        },
        passwords: {
          currentInput: password,
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
        wallets: {
          failureAttemptTimestamps: [],
          setAccountLocked: {},
        },
        passwords: {
          currentInput: 'password',
        },
        wallet: {
          persisted: {
            encryptedPassphrase: 'jumble',
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
        wallets: {
          activeWallet: {
            encryptedPrivateKey: 'jumble',
          },
          failureAttemptTimestamps: [],
          setAccountLocked: {
            unlockTimestamp: now.valueOf() + 150000,
          },
        },
        wallet: {
          persisted: {
            encryptedPassphrase: 'jumble',
          },
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
})
