import {
  InitialiseWallet,
  PersistedAccount,
  UnlockWallet,
  UnlockWalletFailure,
  WalletAccount,
  WalletLoggedInState,
} from '@types'
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

export const unlockWalletRequest = createStandardAction('UNLOCK_WALLET_REQUEST')<Date>()
export const unlockWalletSuccess = createStandardAction('UNLOCK_WALLET_SUCCESS')<UnlockWallet>()
export const unlockWalletFailure = createStandardAction('UNLOCK_WALLET_FAILURE')<
  UnlockWalletFailure
>()

export const tooManyFailedAttempts = createStandardAction('TOO_MANY_FAILED_ATTEMPTS')<Date>()
export const unlockWalletFailureAlert = createAction('UNLOCK_WALLET_FAILURE_ALERT')

export const changeUnlockPasswordInput = createStandardAction('CHANGE_UNLOCK_PASSWORD_INPUT')<
  string
>()
