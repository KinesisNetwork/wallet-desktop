import {
  addAccountToWallet,
  initialiseWallet,
  setActiveAccount,
  unlockWalletNew,
  updateAccountName,
} from '@actions'
import { createStorage } from '@services/storage'
import { RootAction } from '@store'
import { BaseAccount, PersistedAccount, WalletAccount, WalletLoggedInState } from '@types'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import { getType } from 'typesafe-actions'

interface WalletPersistedState {
  encryptedPassphrase: string
  activeAccount: number
  createdAccounts: PersistedAccount[]
  walletName: string
}

interface WalletState extends WalletLoggedInState {
  persisted: WalletPersistedState
}

function accountNameStateChange<T extends BaseAccount>(
  state: any[],
  { existingName, newName }: { existingName: string; newName: string },
): T[] {
  return state.map(a => (a.name === existingName ? { ...a, name: newName } : a))
}

const persisted = combineReducers<WalletPersistedState, RootAction>({
  activeAccount: (state = 0, action) => {
    switch (action.type) {
      case getType(initialiseWallet):
        return 0
      case getType(setActiveAccount):
        return action.payload.accounts.findIndex(a => a === action.payload.targetAccount)
      default:
        return state
    }
  },
  createdAccounts: (state = [], action) => {
    switch (action.type) {
      case getType(initialiseWallet):
        return [action.payload.createdAccount]
      case getType(updateAccountName):
        return accountNameStateChange<PersistedAccount>(state, action.payload)
      case getType(addAccountToWallet):
        return [...state, action.payload.persistedAccount]
      default:
        return state
    }
  },
  encryptedPassphrase: (state = '', action) =>
    action.type === getType(initialiseWallet) ? action.payload.encryptedPassphrase : state,
  walletName: (state = '', action) =>
    action.type === getType(initialiseWallet) ? action.payload.walletName : state,
})

export const wallet = combineReducers<WalletState, RootAction>({
  accounts: (state = [], action) => {
    switch (action.type) {
      case getType(unlockWalletNew):
        return action.payload.accounts
      case getType(updateAccountName):
        return accountNameStateChange<WalletAccount>(state, action.payload)
      case getType(addAccountToWallet):
        return [...state, action.payload.walletAccount]
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
