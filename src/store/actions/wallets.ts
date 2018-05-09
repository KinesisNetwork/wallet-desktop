import { buildAction } from 'typesafe-actions'
import { Wallet } from '@types'

export const loadWallets = buildAction('LOAD_WALLETS').payload<Array<Wallet>>()
export const addWallet = buildAction('ADD_WALLET').payload<Wallet>()
export const selectWallet = buildAction('SELECT_WALLET').payload<number>()
export const deleteWallet = buildAction('DELETE_WALLET').payload<Wallet>()
export const walletsSaved = buildAction('WALLETS_SAVED').payload<Array<Wallet>>()
