import { Wallet } from '@types'
import { buildAction } from 'typesafe-actions'

export const loadWallets = buildAction('LOAD_WALLETS').payload<Wallet[]>()
export const addWallet = buildAction('ADD_WALLET').payload<Wallet>()
export const selectWallet = buildAction('SELECT_WALLET').payload<Wallet>()
export const deleteWallet = buildAction('DELETE_WALLET').payload<Required<Wallet>>()
export const walletsSaved = buildAction('WALLETS_SAVED').payload<Wallet[]>()
