import { AccountResponse } from 'js-kinesis-sdk'
import { buildAction } from 'typesafe-actions'

export const accountLoadRequest = buildAction('LOAD_ACCOUNT_REQUEST').payload<string>()
export const accountLoadSuccess = buildAction('LOAD_ACCOUNT_SUCCESS').payload<AccountResponse>()
export const accountLoadFailure = buildAction('LOAD_ACCOUNT_FAILURE').payload<Error>()

export const accountIsLoading = buildAction('ACCOUNT_IS_LOADING').empty()

export const lockAllAccounts = buildAction('LOCK_ALL_ACCOUNTS').empty()

