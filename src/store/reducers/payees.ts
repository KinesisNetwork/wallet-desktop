import { addPayee, loadPayees, removePayee, updatePayeeForm } from '@actions'
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
      case getType(addPayee):
        return [...state, action.payload]
      case getType(loadPayees):
        return action.payload
      case getType(removePayee):
        return state.filter((payee) => payee.name !== action.payload)
      default: return state
    }
  },
})

function handleChange(name: keyof Payee) {
  return (state = '', action: RootAction) => {
    switch (action.type) {
      case getType(updatePayeeForm):
        return action.payload.field === name ? action.payload.newValue : state
      case getType(addPayee):
        return ''
      default: return state
    }
  }
}
