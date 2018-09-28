import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import { getType } from 'typesafe-actions'

import {
  addAccountToWallet,
  changeUnlockPasswordInput,
  initialiseWallet,
  login,
  setActiveAccount,
  tooManyFailedAttempts,
  unlockWalletFailure,
  unlockWalletNew,
  unlockWalletSuccess,
  updateAccountName,
} from '@actions'
import { createStorage } from '@services/storage'
import { RootAction } from '@store'
import {
  BaseAccount,
  FailedAttemptsToUnlockWallet,
  PersistedAccount,
  WalletAccount,
  WalletLoggedInState,
} from '@types'
import { calculateUnlockTime } from './helpers'

interface WalletPersistedState {
  encryptedPassphrase: string
  activeAccount: number
  createdAccounts: PersistedAccount[]
  failureAttemptTimestamps: Date[]
  setAccountLocked: FailedAttemptsToUnlockWallet
  walletName: string
}

interface PasswordsState {
  currentInput: string
  lastSuccessfulInput: string
  unlockFailureText: string
}

interface WalletState extends WalletLoggedInState {
  passwords: PasswordsState
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
  failureAttemptTimestamps: (state = [], action) => {
    switch (action.type) {
      case getType(unlockWalletSuccess):
        return []
      case getType(unlockWalletFailure):
        return [...state, action.payload.now].filter(timestamp => {
          return calculateUnlockTime(timestamp) >= action.payload.now.valueOf()
        })
      default:
        return state
    }
  },
  setAccountLocked: (state = { unlockTimestamp: 0 }, action) => {
    switch (action.type) {
      case getType(tooManyFailedAttempts):
        return {
          ...state,
          unlockTimestamp: calculateUnlockTime(action.payload),
        }
      default:
        return state
    }
  },
  walletName: (state = '', action) =>
    action.type === getType(initialiseWallet) ? action.payload.walletName : state,
})

const passwords = combineReducers<PasswordsState, RootAction>({
  currentInput: (state = '', action) => {
    switch (action.type) {
      case getType(changeUnlockPasswordInput):
        return action.payload
      case getType(unlockWalletSuccess):
        return ''
      default:
        return state
    }
  },
  lastSuccessfulInput: (state = '', action) => {
    switch (action.type) {
      case getType(initialiseWallet):
      case getType(unlockWalletSuccess):
      case getType(login):
        return action.payload.password
      default:
        return state
    }
  },
  unlockFailureText: (state = '', action) => {
    switch (action.type) {
      case getType(unlockWalletFailure):
        return 'Password is incorrect'
      case getType(tooManyFailedAttempts):
        return 'You have made too many failed attempts. You can try to unlock your account in 5 minutes.'
      case getType(login):
        return ''
      default:
        return state
    }
  },
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
  passwords,
  persisted: persistReducer({ key: 'secure', storage: createStorage() }, persisted),
})
