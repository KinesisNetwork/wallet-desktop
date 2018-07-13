import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

import {
  addWallet,
  changeCreateWalletView,
  changeWalletView,
  updateCreateWalletForm,
} from '@actions'
import { RootAction } from '@store'
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
  privateKey: handleChange('privateKey'),
  password: handleChange('password'),
  passwordVerify: handleChange('passwordVerify'),
})

export const createWallet = combineReducers<CreateWalletState, RootAction>({
  form,
  formView: (state = CreateWalletFormView.select, action) => {
    switch (action.type) {
      case getType(changeCreateWalletView): return action.payload
      case getType(changeWalletView): return CreateWalletFormView.select
      case getType(addWallet): return CreateWalletFormView.select
      default: return state
    }
  },
})
