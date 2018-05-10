import { accountTransactionsLoaded } from '@actions'
import { RootAction } from '@store'
import { TransactionOperationView } from '@types'
import { CollectionPage, TransactionRecord } from 'js-kinesis-sdk'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface TransactionsState {
  transactionOperations: TransactionOperationView[]
  currentPage: CollectionPage<TransactionRecord> | null
  isLastPage: boolean
}

export const transactions = combineReducers<TransactionsState, RootAction>({
  transactionOperations,
  currentPage: (state = null, action) => state,
  isLastPage: (state = false) => state,
})

function transactionOperations(
  state: TransactionOperationView[] = [],
  action: RootAction,
): TransactionOperationView[] {
  switch (action.type) {
    case getType(accountTransactionsLoaded): return [...action.payload]
    default: return state
  }
}
