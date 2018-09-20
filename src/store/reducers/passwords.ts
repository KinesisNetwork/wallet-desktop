import {
  changeUnlockPasswordInput,
  login,
  tooManyFailedAttempts,
  unlockWalletFailure,
  unlockWalletSuccess,
} from '@actions'
import { RootAction } from '@store'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface PasswordsState {
  currentInput: string
  lastSuccessfulInput: string
  unlockFailureText: string
}

export const passwords = combineReducers<PasswordsState, RootAction>({
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
      case getType(unlockWalletSuccess):
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
