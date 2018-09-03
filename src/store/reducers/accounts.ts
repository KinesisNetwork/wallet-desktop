import { accountLoadFailure, accountLoadRequest, accountLoadSuccess } from '@actions'
import { getBalance } from '@services/accounts'
import { RootAction } from '@store'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

interface AccountInfo {
  balance: number
}

export interface AccountsState {
  readonly isAccountLoading: boolean
  readonly accountInfo: AccountInfo
}

const accountInfo = combineReducers<AccountInfo, RootAction>({
  balance: (state = 0, action) => {
    switch (action.type) {
      case getType(accountLoadSuccess):
        return getBalance(action.payload)
      case getType(accountLoadFailure):
        return 0
      default:
        return state
    }
  },
})

export const accounts = combineReducers<AccountsState, RootAction>({
  accountInfo,
  isAccountLoading: (state = false, action) => {
    switch (action.type) {
      case getType(accountLoadRequest):
        return true

      case getType(accountLoadSuccess):
      case getType(accountLoadFailure):
        return false
      default:
        return state
    }
  },
})
