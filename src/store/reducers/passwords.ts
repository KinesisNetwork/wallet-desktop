import { combineReducers } from 'redux'
import { PasswordMap } from '@types'
import { RootAction } from '@store'
import { getType } from 'typesafe-actions';
import { changeUnlockPasswordInput, unlockWallet, lockWallet } from '@actions'

export interface PasswordsState {
  currentInput: string
  map: PasswordMap
}

export const passwords = combineReducers<PasswordsState, RootAction>({
  currentInput: (state = '', action) => {
    switch (action.type) {
      case getType(changeUnlockPasswordInput): return action.payload
      case getType(unlockWallet): return ''
      default: return state
    }
  },
  map: (state = {}, action) => {
    switch (action.type) {
      case getType(unlockWallet):
        return {
          ...state,
          [action.payload.publicKey]: {
            password: action.payload.password,
            timestamp: new Date(),
          }
        }
      case getType(lockWallet):
        return Object.keys(state)
          .filter((key) => key !== action.payload.publicKey)
          .reduce((newState, key) => ({...newState, [key]: state[key]}), {})
      default: return state
    }
  },
})
