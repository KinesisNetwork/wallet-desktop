import { setPassphrase, updateFormField } from '@actions'
import { RootAction } from '@store'
import { WALLET_CREATE_FORM_NAME } from '@types'
import { combineReducers, Reducer } from 'redux'
import { getType } from 'typesafe-actions'

interface WalletCreationState {
  name: string
  password: string
  confirmPassword: string
  passphrase: string
}

interface WalletState {
  create: WalletCreationState
}

function isChangeAction(action: ReturnType<typeof updateFormField>, formField: string) {
  return (
    action.payload.formName === WALLET_CREATE_FORM_NAME && action.payload.formField === formField
  )
}

const handleChange = (formField: keyof WalletCreationState): Reducer<string, RootAction> => (
  state = '',
  action,
) =>
  action.type === getType(updateFormField) && isChangeAction(action, formField)
    ? action.payload.fieldValue
    : state

const create = combineReducers<WalletCreationState, RootAction>({
  confirmPassword: handleChange('confirmPassword'),
  name: handleChange('name'),
  password: handleChange('password'),
  passphrase: (state = '', action) =>
    action.type === getType(setPassphrase) ? action.payload.passphrase : state,
})

export const wallet = combineReducers<WalletState, RootAction>({
  create,
})
