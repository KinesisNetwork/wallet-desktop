import { TransferRequest } from '@types';
import { combineReducers } from 'redux';
import { RootAction } from '@store';
import { getType } from 'typesafe-actions';
import { updateTransferForm, transferRequest, transferSuccess, transferFailed } from '@actions';

export interface TransferState {
  readonly form: TransferRequest
  readonly isTransferring: boolean
}

export const transfer = combineReducers<TransferState, RootAction>({
  form: combineReducers<TransferRequest, RootAction>({
    amount: handleChange('amount'),
    targetAddress: handleChange('targetAddress'),
    memo: handleChange('memo'),
  }),
  isTransferring: (state = false, action) => {
    switch (action.type) {
      case getType(transferRequest): return true

      case getType(transferSuccess):
      case getType(transferFailed):
        return false

      default: return state
    }
  }
})

function handleChange (name: keyof TransferRequest) {
  return (state = '', action: RootAction) => {
    switch (action.type) {
      case getType(updateTransferForm):
        return action.payload.field === name ? action.payload.newValue : state
      default: return state
    }
  }
}
