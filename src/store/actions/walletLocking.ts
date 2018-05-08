import { buildAction } from 'typesafe-actions'
import { Wallet } from '@types'

export const unlockWallet = buildAction('UNLOCK_WALLET').payload<{password: string, publicKey: string}>()
export const changeUnlockPasswordInput = buildAction('CHANGE_UNLOCK_PASSWORD_INPUT').payload<string>()
export const lockWallet = buildAction('LOCK_WALLET').payload<Wallet>()
