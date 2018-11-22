import { accountTransactionsLoaded, loadAccountTransactions } from '@actions'
import { RootAction } from '@store'
import { TransactionOperationView } from '@types'
import { CollectionPage, TransactionRecord } from 'js-kinesis-sdk'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface TransactionsState {
  transactionOperations: TransactionOperationView[]
  currentPage: CollectionPage<TransactionRecord> | null
  isLastPage: boolean
  isLoading: boolean
}

export const transactions = combineReducers<TransactionsState, RootAction>({
  transactionOperations,
  currentPage: (state = null, action) => {
    switch (action.type) {
      case getType(accountTransactionsLoaded):
        return action.payload.transactionPage
      default:
        return state
    }
  },
  isLastPage: (state = false, action) => {
    switch (action.type) {
      case getType(accountTransactionsLoaded):
        return action.payload.transactionPage === null
      default:
        return state
    }
  },
  isLoading: (state = false, action) => {
    switch (action.type) {
      case getType(loadAccountTransactions):
        return true
      case getType(accountTransactionsLoaded):
        return false
      default:
        return state
    }
  },
})

function transactionOperations(
  state: TransactionOperationView[] = [],
  action: RootAction,
): TransactionOperationView[] {
  switch (action.type) {
    case getType(loadAccountTransactions):
      return []
    case getType(accountTransactionsLoaded):
      const newTransactions = action.payload.operations.filter(({ id }) => {
        return state.every(({ id: existingId }) => id !== existingId)
      })
      return state.concat(newTransactions)
    default:
      return state
  }
}
