import {
  addPayee,
  changeWalletView,
  selectWallet,
  transactionFailed,
  transactionSuccess,
  transferRequest,
  updateTransferForm,
} from '@actions'
import { RootAction } from '@store'
import { TransferRequest } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface TransferState {
  readonly form: TransferRequest
  readonly isTransferring: boolean
}

export const transfer = combineReducers<TransferState, RootAction>({
  form: combineReducers<TransferRequest, RootAction>({
    amount: handleChange('amount'),
    targetPayee: handleChange('targetPayee'),
    memo: handleChange('memo'),
  }),
  isTransferring: (state = false, action) => {
    switch (action.type) {
      case getType(transferRequest):
        return true

      case getType(transactionSuccess):
      case getType(transactionFailed):
        return false

      default:
        return state
    }
  },
})

function handleChange(name: keyof TransferRequest) {
  return (state = '', action: RootAction) => {
    switch (action.type) {
      case getType(updateTransferForm):
        return action.payload.field === name ? action.payload.newValue : state
      case getType(addPayee):
        return name === 'targetPayee' ? action.payload.publicKey : state

      case getType(changeWalletView):
      case getType(selectWallet):
      case getType(transactionSuccess):
        return ''
      default:
        return state
    }
  }
}
