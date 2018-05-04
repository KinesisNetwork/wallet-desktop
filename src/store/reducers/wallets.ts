import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { RootAction } from '@store'
import { Wallet } from '@types'
import { loadWallets, addWallet, selectWallet } from '@actions'

export interface WalletsState {
  readonly walletList: Wallet[]
  readonly currentlySelected: number
}

export const wallets = combineReducers<WalletsState, RootAction>({
  walletList: (state = [], action) => {
    switch (action.type) {
      case getType(loadWallets): return [...action.payload]
      case getType(addWallet): return [...state, action.payload]
      default: return state
    }
  },
  currentlySelected: (state = 0, action) => {
    switch (action.type) {
      case getType(selectWallet): return action.payload
      default: return state
    }
  },
})
