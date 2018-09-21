import { Transaction } from 'js-kinesis-sdk'
import { buildAction } from 'typesafe-actions'

import { FormUpdate, TransactionLoader, TransferRequest } from '@types'

export const transferRequest = buildAction('TRANSFER_REQUEST').payload<TransferRequest>()

export const updateTransferForm = buildAction('UPDATE_TRANSFER_FORM').payload<
  FormUpdate<TransferRequest>
  >()

export const accountTransactionsLoaded = buildAction('ACCOUNT_TRANSACTIONS_LOADED').payload<
  TransactionLoader
  >()
export const loadAccountTransactions = buildAction('LOAD_ACCOUNT_TRANSACTIONS').payload<string>()
export const loadNextTransactionPage = buildAction('LOAD_NEXT_TRANSACTION_PAGE').empty()

export const transactionRequest = buildAction('TRANSACTION_SUBMIT_REQUEST').payload<Transaction>()
export const transactionSuccess = buildAction('TRANSACTION_SUBMIT_SUCCESS').payload<void>()
export const transactionFailed = buildAction('TRANSACTION_SUBMIT_FAILED').payload<Error>()

export const updateFee = buildAction('UPDATE_FEE').payload<string>()
export const insufficientFunds = buildAction('INSUFFICIENT_FUNDS').payload<boolean>()
export const updateRemainingBalance = buildAction('UPDATE_REMAINING_BALANCE').payload<number>()
export const publicKeyValidation = buildAction('PUBLIC_KEY_VALIDATION').payload<boolean>()
export const saveToContact = buildAction('SAVE_TO_CONTACT').empty()
