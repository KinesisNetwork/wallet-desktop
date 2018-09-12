import { setPassphrase, updateFormField } from '@actions'
import { RootAction } from '@store'
import { WALLET_CREATE_FORM_NAME } from '@types'
import { combineReducers, Reducer } from 'redux'
import { getType } from 'typesafe-actions'

interface WalletCreationForm {
  name: string
  password: string
  confirmPassword: string
}

interface PassphraseState {
  creation: string
  encrypted: string
}

interface WalletState {
  createForm: WalletCreationForm
  passphrase: PassphraseState
}

function isChangeAction(action: ReturnType<typeof updateFormField>, formField: string) {
  return (
    action.payload.formName === WALLET_CREATE_FORM_NAME && action.payload.formField === formField
  )
}

const handleChange = (formField: keyof WalletCreationForm): Reducer<string, RootAction> => (
  state = '',
  action,
) =>
  action.type === getType(updateFormField) && isChangeAction(action, formField)
    ? action.payload.fieldValue
    : state

const createForm = combineReducers<WalletCreationForm, RootAction>({
  confirmPassword: handleChange('confirmPassword'),
  name: handleChange('name'),
  password: handleChange('password'),
})

const passphrase = combineReducers<PassphraseState, RootAction>({
  creation: (state = '', action) =>
    action.type === getType(setPassphrase) ? action.payload.passphrase : state,
  encrypted: (state = '') => state,
})

export const wallet = combineReducers<WalletState, RootAction>({
  createForm,
  passphrase,
})
