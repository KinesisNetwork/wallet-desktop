import { FormUpdate, TransactionOperationView, TransferRequest } from '@types'
import { buildAction } from 'typesafe-actions'

export const transferRequest = buildAction('TRANSFER_REQUEST').payload<TransferRequest>()
export const transferSuccess = buildAction('TRANSFER_SUCCESS').payload<string>()
export const transferFailed = buildAction('TRANSFER_FAILED').payload<Error>()
export const updateTransferForm = buildAction('UPDATE_TRANSFER_FORM').payload<FormUpdate<TransferRequest>>()

export const accountTransactionsLoaded = buildAction('ACCOUNT_TRANSACTIONS_LOADED')
  .payload<TransactionOperationView[]>()
export const loadAccountTransactions = buildAction('LOAD_ACCOUNT_TRANSACTIONS').payload<string>()
export const loadNextTransactionPage = buildAction('LOAD_NEXT_TRANSACTION_PAGE').empty()
