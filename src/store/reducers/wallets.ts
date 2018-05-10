import { addWallet, deleteWallet, loadWallets, lockWallet, selectWallet, unlockWallet, walletsSaved } from '@actions'
import { RootAction } from '@store'
import { Wallet } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface WalletsState {
  readonly walletList: Wallet[]
  readonly currentlySelected: number
}

export const wallets = combineReducers<WalletsState, RootAction>({
  walletList: (state = [], action) => {
    switch (action.type) {
      case getType(loadWallets): return [...action.payload]
      case getType(addWallet): return [...state, action.payload]
      case getType(walletsSaved): return [...action.payload]

      case getType(unlockWallet):
        return state.map(
          (wallet): Wallet => wallet.publicKey === action.payload.publicKey
            ? {...wallet, decryptedPrivateKey: action.payload.decryptedPrivateKey}
            : wallet,
          )

      case getType(lockWallet):
        return state.map(
          (wallet): Wallet => wallet.publicKey === action.payload.publicKey
            ? {...wallet, decryptedPrivateKey: undefined}
            : wallet,
        )
      default: return state
    }
  },
  currentlySelected: (state = 0, action) => {
    switch (action.type) {
      case getType(selectWallet): return action.payload
      case getType(deleteWallet): return state > 0 ? state - 1 : 0
      default: return state
    }
  },
})
