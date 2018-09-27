import { InitialiseWallet, PersistedAccount, WalletAccount, WalletLoggedInState } from '@types'
import { createAction, createStandardAction } from 'typesafe-actions'

export const startWalletCreation = createAction('START_CREATE_WALLET')
export const finaliseWalletCreation = createAction('FINALISE_CREATE_WALLET')
export const createPassphrase = createStandardAction('CREATE_PASSPHRASE')<{ passphrase: string }>()
export const initialiseWallet = createStandardAction('INITIALISE_WALLET')<InitialiseWallet>()

export const addNextAccountFromSeedphrase = createAction('ADD_NEXT_ACCOUNT_FROM_SEEDPHRASE')
export const importAccountFromSecret = createStandardAction('IMPORT_ACCOUNT_FROM_SECRET')<{
  secret: string
}>()
export const addAccountToWallet = createStandardAction('ADD_ACCOUNT_TO_WALLET')<{
  persistedAccount: PersistedAccount
  walletAccount: WalletAccount
}>()

export const login = createStandardAction('LOGIN_TO_WALLET')<{ password: string }>()
export const unlockWalletNew = createStandardAction('UNLOCK_WALLET_NEW')<WalletLoggedInState>()
