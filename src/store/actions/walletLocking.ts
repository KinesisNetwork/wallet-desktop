import { UnlockWallet, Wallet } from '@types'
import { buildAction } from 'typesafe-actions'

export const unlockWallet = buildAction('UNLOCK_WALLET').payload<UnlockWallet>()
export const changeUnlockPasswordInput = buildAction('CHANGE_UNLOCK_PASSWORD_INPUT').payload<string>()
export const lockWallet = buildAction('LOCK_WALLET').payload<Wallet>()
