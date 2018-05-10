import {
  accountIsLoading,
  accountLoadFailure,
  accountLoadSuccess,
  addWallet,
  loadWallets,
  lockWallet,
  unlockWallet,
} from '@actions'
import { AccountMissingError } from '@helpers/errors'
import { getBalance } from '@services/accounts'
import { RootAction } from '@store'
import { Account } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface AccountsState {
  readonly accountsMap: {[key: string]: Account}
  readonly isAccountLoading: boolean
}

export const accounts = combineReducers<AccountsState, RootAction>({
  accountsMap: (state = {}, action) => {
    switch (action.type) {
      case getType(loadWallets):
        return action.payload
          .reduce((acc, wallet) => ({...acc, [wallet.publicKey]: {balance: '', isUnlocked: false }}), {})
      case getType(addWallet):
        return {
          ...state,
          [action.payload.publicKey]: {
            balance: '0',
            isUnlocked: false,
          },
        }
      case getType(unlockWallet):
        return {
          ...state,
          [action.payload.publicKey]: {
            ...state[action.payload.publicKey],
            isUnlocked: true,
          },
        }
      case getType(lockWallet):
        return {
          ...state,
          [action.payload.publicKey]: {
            ...state[action.payload.publicKey],
            isUnlocked: false,
          },
        }
      case getType(accountLoadSuccess):
        return {
          ...state,
          [action.payload.account_id]: {
            ...state[action.payload.account_id],
            balance: getBalance(action.payload),
          },
        }
      case getType(accountLoadFailure):
        const e = action.payload
        return e instanceof AccountMissingError
          ? {
            ...state,
            [e.publicKey]: {
              ...state[e.publicKey],
              balance: '0',
            },
          }
          : state
      default: return state
    }
  },
  isAccountLoading: (state = false, action) => {
    switch (action.type) {
      case getType(accountIsLoading): return true

      case getType(accountLoadSuccess):
      case getType(accountLoadFailure):
        return false
      default: return state
    }
  },
})