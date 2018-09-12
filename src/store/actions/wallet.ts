import { PersistedAccount, WalletLoggedInState } from '@types'
import { buildAction } from 'typesafe-actions'

export const startWalletCreation = buildAction('START_CREATE_WALLET').empty()
export const finaliseWalletCreation = buildAction('FINALISE_CREATE_WALLET').empty()
export const createPassphrase = buildAction('CREATE_PASSPHRASE').payload<{ passphrase: string }>()

interface InitialiseWallet {
  encryptedPassphrase: string
  createdAccount: PersistedAccount
}
export const initialiseWallet = buildAction('INITIALISE_WALLET').payload<InitialiseWallet>()

export const login = buildAction('LOGIN_TO_WALLET').payload<{ password: string }>()
export const unlockWalletNew = buildAction('UNLOCK_WALLET_NEW').payload<WalletLoggedInState>()
