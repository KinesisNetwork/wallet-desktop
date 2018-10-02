import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import { getType } from 'typesafe-actions'

import {
  changeUnlockPasswordInput,
  initialiseWallet,
  login as loginAction,
  tooManyFailedAttempts,
  unlockWalletFailure,
  unlockWalletSuccess,
} from '@actions'
import { createStorage } from '@services/storage'
import { IS_DEV, RootAction } from '@store'

interface LoginState {
  input: LoginInputState
}

interface LoginInputState {
  currentInput: string
  lastSuccessfulInput: string
  unlockFailureText: string
}

const input = combineReducers<LoginInputState, RootAction>({
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
      case getType(loginAction):
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
      case getType(loginAction):
        return ''
      default:
        return state
    }
  },
})

export const login = combineReducers<LoginState, RootAction>({
  input: IS_DEV
    ? persistReducer({ key: 'devWalletUnlock', storage: createStorage() }, input)
    : input,
})
