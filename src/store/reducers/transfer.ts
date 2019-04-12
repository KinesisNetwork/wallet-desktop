import {
  addContact,
  insufficientFunds,
  publicKeyValidation,
  transactionFailed,
  transactionRequest,
  transactionSuccess,
  transferRequest,
  updateFee,
  updateMinimumBalance,
  updateRemainingBalance,
  updateTransferForm,
} from '@actions'
import { RootAction } from '@store'
import { FormErrors, TransferRequest } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

interface FormMeta {
  readonly errors: FormErrors
  readonly minimumBalance: number
  readonly remainingBalance: number
}

export interface TransferState {
  readonly formData: TransferRequest
  readonly isTransferring: boolean
  readonly formMeta: FormMeta
}

const formMeta = combineReducers<FormMeta, RootAction>({
  minimumBalance: (state = 0, action) => {
    switch (action.type) {
      case getType(updateMinimumBalance):
        return action.payload
      default:
        return state
    }
  },
  remainingBalance: (state = 0, action) => {
    switch (action.type) {
      case getType(updateRemainingBalance):
        return action.payload
      default:
        return state
    }
  },
  errors: combineReducers<FormErrors, RootAction>({
    amount: handleError('amount'),
    memo: handleError('memo'),
    targetPayee: handleError('targetPayee'),
  }),
})

function handleError(name: keyof FormErrors) {
  return (state = '', action: RootAction) => {
    switch (action.type) {
      case getType(insufficientFunds):
        return name === 'amount' && action.payload ? 'Insufficient funds' : ''
      case getType(updateTransferForm):
        return name === 'memo' &&
          action.payload.field === 'memo' &&
          action.payload.newValue.length > 25
          ? `${action.payload.newValue.length} / 25`
          : name === 'amount'
            ? state
            : ''
      case getType(publicKeyValidation):
        return name === 'targetPayee' && !action.payload ? 'Invalid Kinesis Address' : ''
      default:
        return state
    }
  }
}

export const transfer = combineReducers<TransferState, RootAction>({
  formData: combineReducers<TransferRequest, RootAction>({
    amount: handleChange('amount'),
    targetPayee: handleChange('targetPayee'),
    memo: handleChange('memo'),
    fee: handleChange('fee'),
  }),
  formMeta,
  isTransferring: (state = false, action) => {
    switch (action.type) {
      case getType(transferRequest):
      case getType(transactionRequest):
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
        if (action.payload.field === name) {
          return action.payload.newValue
        }
        return state
      case getType(updateFee):
        return name === 'fee' ? action.payload : state
      case getType(addContact):
        return name === 'targetPayee' ? action.payload.address : state
      case getType(transactionSuccess):
        return ''
      default:
        return state
    }
  }
}
