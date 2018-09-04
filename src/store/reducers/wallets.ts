import {
  addWallet,
  clearWalletFailures,
  deleteWallet,
  loadWallets,
  selectWallet,
  unlockWalletFailure,
  unlockWalletSuccess,
  walletsSaved
} from '@actions'
import { RootAction } from '@store'
import { Wallet } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface WalletsState {
  readonly walletList: Wallet[]
  readonly currentlySelected: number
  readonly activeWallet: Wallet | null
  readonly failureAttemptTimestamps: number[]
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
  failureAttemptTimestamps: (state = [], action) => {
    switch (action.type) {
      case getType(unlockWalletSuccess):
      case getType(clearWalletFailures):
        return []
      case getType(unlockWalletFailure):
        return [...state, action.payload]
      default:
        return state
    }
  }
})
