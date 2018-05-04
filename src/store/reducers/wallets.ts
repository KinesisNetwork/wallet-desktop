import { combineReducers } from 'redux'
import { RootAction } from '@store'
import { Wallet } from '@types'
export interface WalletsState {
  readonly wallets: Wallet[]
  readonly currentlySelected: number
}

export const wallets = combineReducers<WalletsState, RootAction>({
  wallets: (state = []) => state,
  currentlySelected: (state = 0) => state,
})
