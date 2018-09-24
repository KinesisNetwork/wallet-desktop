import { PersistedAccount, WalletAccount, WalletLoggedInState } from '@types'
import { buildAction } from 'typesafe-actions'

export const startWalletCreation = buildAction('START_CREATE_WALLET').empty()
export const finaliseWalletCreation = buildAction('FINALISE_CREATE_WALLET').empty()
export const createPassphrase = buildAction('CREATE_PASSPHRASE').payload<{ passphrase: string }>()

interface InitialiseWallet {
  encryptedPassphrase: string
  createdAccount: PersistedAccount
  walletName: string
  password: string
}
export const initialiseWallet = buildAction('INITIALISE_WALLET').payload<InitialiseWallet>()

export const addNextAccountFromSeedphrase = buildAction('ADD_NEXT_ACCOUNT_FROM_SEEDPHRASE').empty()
export const importAccountFromSecret = buildAction('IMPORT_ACCOUNT_FROM_SECRET').payload<{
  secret: string
}>()
export const addAccountToWallet = buildAction('ADD_ACCOUNT_TO_WALLET').payload<{
  persistedAccount: PersistedAccount
  walletAccount: WalletAccount
}>()

export const login = buildAction('LOGIN_TO_WALLET').payload<{ password: string }>()
export const unlockWalletNew = buildAction('UNLOCK_WALLET_NEW').payload<WalletLoggedInState>()
