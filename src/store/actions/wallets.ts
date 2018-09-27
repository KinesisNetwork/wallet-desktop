import { UnlockWallet, UnlockWalletFailure, Wallet } from '@types'
import { createAction, createStandardAction } from 'typesafe-actions'

export const loadWallets = createStandardAction('LOAD_WALLETS')<Wallet[]>()
export const addWallet = createStandardAction('ADD_WALLET')<Wallet>()
export const selectWallet = createStandardAction('SELECT_WALLET')<Wallet>()
export const deleteWallet = createStandardAction('DELETE_WALLET')<
  Wallet & { decryptedPrivateKey: string }
>()
export const walletsSaved = createStandardAction('WALLETS_SAVED')<Wallet[]>()

export const unlockWalletRequest = createStandardAction('UNLOCK_WALLET_REQUEST')<Date>()
export const unlockWalletSuccess = createStandardAction('UNLOCK_WALLET_SUCCESS')<UnlockWallet>()
export const unlockWalletFailure = createStandardAction('UNLOCK_WALLET_FAILURE')<
  UnlockWalletFailure
>()
export const unlockWallet = createStandardAction('UNLOCK_WALLET')<UnlockWallet>()
export const changeUnlockPasswordInput = createStandardAction('CHANGE_UNLOCK_PASSWORD_INPUT')<
  string
>()
export const lockWallet = createStandardAction('LOCK_WALLET')<string>()
export const tooManyFailedAttempts = createStandardAction('TOO_MANY_FAILED_ATTEMPTS')<Date>()
export const unlockWalletFailureAlert = createAction('UNLOCK_WALLET_FAILURE_ALERT')
