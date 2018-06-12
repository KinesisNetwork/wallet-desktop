import { changeSignFocus, signMessage, updateSignForm, updateVerifyForm, verifyMessage } from '@actions'
import { RootAction } from '@store'
import { RawMessage, SignBehaviour, SignedMessage } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface SignState {
  focus: SignBehaviour
  signData: RawMessage
  verifyData: SignedMessage
  signature: string
  isValidSignature: boolean
}

export const sign = combineReducers<SignState, RootAction>({
  focus: (state = SignBehaviour.sign, action) => {
    switch (action.type) {
      case getType(changeSignFocus): return action.payload
      default: return state
    }
  },
  signData: combineReducers<RawMessage, RootAction>({
    message: handleChange('message'),
  }),
  verifyData: combineReducers<SignedMessage, RootAction>({
    message: handleChange('message'),
    signature: handleChange('signature'),
    publicKey: handleChange('publicKey'),
  }),
  signature: (state = '', action) => {
    switch (action.type) {
      case getType(signMessage): return action.payload
      default: return state
    }
  },
  isValidSignature: (state = false, action) => {
    switch (action.type) {
      case getType(verifyMessage): return action.payload
      default: return state
    }
  },
})

function handleChange(name: keyof SignedMessage) {
  return (state = '', action: RootAction) => {
    switch (action.type) {
      case getType(updateSignForm):
      case getType(updateVerifyForm):
        return action.payload.field === name ? action.payload.newValue : state
      default: return state
    }
  }
}