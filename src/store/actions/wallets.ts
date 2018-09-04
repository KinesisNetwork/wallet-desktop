import { UnlockWallet, Wallet } from '@types'
import { buildAction } from 'typesafe-actions'

export const loadWallets = buildAction('LOAD_WALLETS').payload<Wallet[]>()
export const addWallet = buildAction('ADD_WALLET').payload<Wallet>()
export const selectWallet = buildAction('SELECT_WALLET').payload<Wallet>()
export const deleteWallet = buildAction('DELETE_WALLET').payload<
  Wallet & { decryptedPrivateKey: string }
  >()
export const walletsSaved = buildAction('WALLETS_SAVED').payload<Wallet[]>()

export const unlockWalletRequest = buildAction('UNLOCK_WALLET_REQUEST').empty()
export const unlockWalletSuccess = buildAction('UNLOCK_WALLET_SUCCESS').payload<UnlockWallet>()
export const unlockWalletFailure = buildAction('UNLOCK_WALLET_FAILURE').payload<number>()
export const unlockWallet = buildAction('UNLOCK_WALLET').payload<UnlockWallet>()
export const changeUnlockPasswordInput = buildAction('CHANGE_UNLOCK_PASSWORD_INPUT').payload<
  string
  >()
export const lockWallet = buildAction('LOCK_WALLET').payload<string>()
export const clearWalletFailures = buildAction('CLEAR_WALLET_FAILURES').empty()
export const failureAttemptMessage = buildAction('FAILURE_ATTEMPT_MESSAGE').empty()
