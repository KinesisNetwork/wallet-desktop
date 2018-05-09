import { buildAction } from 'typesafe-actions'
import { AccountResponse } from 'js-kinesis-sdk'

export const accountLoadRequest = buildAction('LOAD_ACCOUNT_REQUEST').payload<string>()
export const accountLoadSuccess = buildAction('LOAD_ACCOUNT_SUCCESS').payload<AccountResponse>()
export const accountLoadFailure = buildAction('LOAD_ACCOUNT_FAILURE').payload<Error>()

export const accountIsLoading = buildAction('ACCOUNT_IS_LOADING').empty()
