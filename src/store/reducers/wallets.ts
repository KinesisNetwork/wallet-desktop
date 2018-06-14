import { addWallet, deleteWallet, loadWallets, lockWallet, selectWallet, unlockWallet, walletsSaved } from '@actions'
import { RootAction } from '@store'
import { Wallet } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface WalletsState {
  readonly walletList: Wallet[]
  readonly currentlySelected: number
  readonly activeWallet: Wallet | null
}

export const wallets = combineReducers<WalletsState, RootAction>({
  currentlySelected: (state = -1) => state,
  activeWallet: (state = null, action) => {
    switch (action.type) {
      case getType(lockWallet):
        return { ...action.payload, decryptedPrivateKey: undefined }
      case getType(unlockWallet):
        const activeWallet = state as Wallet
        return { ...activeWallet, decryptedPrivateKey: action.payload.decryptedPrivateKey }
      case getType(addWallet):
      case getType(selectWallet):
        return { ...state, ...action.payload }
      default: return state
    }
  },
  walletList: (state = [], action) => {
    switch (action.type) {
      case getType(loadWallets): return [...action.payload]
      case getType(addWallet): return [...state, action.payload]
      case getType(deleteWallet): return state.filter((wallet) => wallet.publicKey !== action.payload.publicKey)
      case getType(walletsSaved): return [...action.payload]
      default: return state
    }
  },
})
