import { initialiseWallet, unlockWalletNew } from '@actions'
import { createStorage } from '@services/storage'
import { RootAction } from '@store'
import { PersistedAccount, WalletLoggedInState } from '@types'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import { getType } from 'typesafe-actions'

interface WalletPersistedState {
  encryptedPassphrase: string
  activeAccount: number
  createdAccounts: PersistedAccount[]
}

interface WalletState extends WalletLoggedInState {
  persisted: WalletPersistedState
}

const persisted = combineReducers<WalletPersistedState, RootAction>({
  activeAccount: (state = 0, action) => {
    switch (action.type) {
      case getType(initialiseWallet):
        return 0
      default:
        return state
    }
  },
  createdAccounts: (state = [], action) => {
    switch (action.type) {
      case getType(initialiseWallet):
        return [action.payload.createdAccount]
      default:
        return state
    }
  },
  encryptedPassphrase: (state = '', action) =>
    action.type === getType(initialiseWallet) ? action.payload.encryptedPassphrase : state,
})

export const wallet = combineReducers<WalletState, RootAction>({
  accounts: (state = [], action) => {
    switch (action.type) {
      case getType(unlockWalletNew):
        return action.payload.accounts
      default:
        return state
    }
  },
  passphrase: (state = '', action) => {
    switch (action.type) {
      case getType(unlockWalletNew):
        return action.payload.passphrase
      default:
        return state
    }
  },
  persisted: persistReducer({ key: 'secure', storage: createStorage() }, persisted),
})
