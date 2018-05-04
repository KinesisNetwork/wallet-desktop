import { combineReducers } from 'redux'
import { RootAction } from '@store'
import { getType } from 'typesafe-actions'
import { updateCreateWalletForm, addWallet, changeCreateWalletView } from '@actions';
import { CreateWalletForm, CreateWalletFormView } from '@types'

export interface CreateWalletState {
  readonly form: CreateWalletForm
  readonly formView: CreateWalletFormView
}

const handleChange = (name: keyof CreateWalletForm) => (state = '', action: RootAction) => {
  switch (action.type) {
    case getType(updateCreateWalletForm):
      return action.payload.field === name ? action.payload.newValue : state
    case getType(addWallet): return ''
    default: return state
  }
}

const form = combineReducers<CreateWalletForm, RootAction>({
  accountName: handleChange('accountName'),
  publicKey: handleChange('publicKey'),
  privateKey: handleChange('privateKey'),
  password: handleChange('password'),
  passwordVerify: handleChange('passwordVerify'),
})

export const createWallet = combineReducers<CreateWalletState, RootAction>({
  form,
  formView: (state = CreateWalletFormView.select, action) => {
    switch (action.type) {
      case getType(changeCreateWalletView): return action.payload
      default: return state
    }
  },
})
