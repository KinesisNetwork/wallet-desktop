import { Transaction } from 'js-kinesis-sdk'
import { createAction, createStandardAction } from 'typesafe-actions'

import { FormUpdate, TransactionLoader, TransferRequest } from '@types'

export const transferRequest = createStandardAction('TRANSFER_REQUEST')<TransferRequest>()

export const updateTransferForm = createStandardAction('UPDATE_TRANSFER_FORM')<
  FormUpdate<TransferRequest>
>()

export const accountTransactionsLoaded = createStandardAction('ACCOUNT_TRANSACTIONS_LOADED')<
  TransactionLoader
>()
export const loadAccountTransactions = createStandardAction('LOAD_ACCOUNT_TRANSACTIONS')<string>()
export const loadNextTransactionPage = createAction('LOAD_NEXT_TRANSACTION_PAGE')
export const nextTransactionPageLoaded = createStandardAction('NEXT_TRANSACTION_PAGE_LOADED')<
  TransactionLoader
>()

export const transactionRequest = createStandardAction('TRANSACTION_SUBMIT_REQUEST')<Transaction>()
export const transactionSuccess = createAction('TRANSACTION_SUBMIT_SUCCESS')
export const transactionFailed = createStandardAction('TRANSACTION_SUBMIT_FAILED')<Error>()

export const updateFee = createStandardAction('UPDATE_FEE')<string>()
export const insufficientFunds = createStandardAction('INSUFFICIENT_FUNDS')<boolean>()
export const updateRemainingBalance = createStandardAction('UPDATE_REMAINING_BALANCE')<number>()
export const publicKeyValidation = createStandardAction('PUBLIC_KEY_VALIDATION')<boolean>()
export const saveToContact = createAction('SAVE_TO_CONTACT')
