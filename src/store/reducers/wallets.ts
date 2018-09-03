import { addWallet, deleteWallet, loadWallets, selectWallet, unlockWalletFailure, walletsSaved } from '@actions'
import { RootAction } from '@store'
import { LockAccount, Wallet } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface WalletsState {
  readonly walletList: Wallet[]
  readonly currentlySelected: number
  readonly activeWallet: Wallet | null
  readonly accountLocked: LockAccount
}

export const wallets = combineReducers<WalletsState, RootAction>({
  currentlySelected: (state = -1) => state,
  activeWallet: (state = null, action) => {
    switch (action.type) {
      case getType(addWallet):
      case getType(selectWallet):
        return { ...state, ...action.payload }
      default:
        return state
    }
  },
  walletList: (state = [], action) => {
    switch (action.type) {
      case getType(loadWallets):
        return [...action.payload]
      case getType(addWallet):
        return [...state, action.payload]
      case getType(deleteWallet):
        return state.filter(wallet => wallet.publicKey !== action.payload.publicKey)
      case getType(walletsSaved):
        return [...action.payload]
      default:
        return state
    }
  },
  accountLocked: (state = { isAccountLocked: false, timestamps: [] }, action) => {
    switch (action.type) {
      case getType(unlockWalletFailure):
        return shouldGetLocked(state.timestamps) ?
          {
            isAccountLocked: true,
            timestamps: [...state.timestamps, action.payload.timestamp]
          } :
          {
            isAccountLocked: false,
            timestamps: [...state.timestamps, action.payload.timestamp]
          }
      default:
        return state
    }
  }
})

function shouldGetLocked(timestamps: number[]): boolean {
  const length = timestamps.length
  const TIME_LIMIT_IN_MS = 5 * 60 * 1000
  const MAX_ATTEMPTS = 10

  if (
    length > MAX_ATTEMPTS &&
    (timestamps[length] - timestamps[length - MAX_ATTEMPTS] < TIME_LIMIT_IN_MS)
  ) {
    return true
  }

  return false
}
