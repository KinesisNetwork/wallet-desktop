import { setPayee, updatePayeeForm } from '@actions'
import { RootAction } from '@store'
import { Payee } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface PayeeState {
  form: Payee
  payees: Payee[]
}

export const payees = combineReducers<PayeeState, RootAction>({
  form: combineReducers<Payee, RootAction>({
    name: handleChange('name'),
    publicKey: handleChange('publicKey'),
  }),
  payees: (state = [], action) => {
    switch (action.type) {
      case getType(setPayee):
        return state.concat(action.payload)
      default: return state
    }
  },
})

function handleChange(name: keyof Payee) {
  return (state = '', action: RootAction) => {
    switch (action.type) {
      case getType(updatePayeeForm):
        return action.payload.field === name ? action.payload.newValue : state
      default: return state
    }
  }
}
