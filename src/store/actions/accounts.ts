import { PersistedAccount } from '@types'
import { AccountResponse } from 'js-kinesis-sdk'
import { createAction, createStandardAction } from 'typesafe-actions'

export const accountLoadRequest = createStandardAction('LOAD_ACCOUNT_REQUEST')<string>()
export const accountLoadSuccess = createStandardAction('LOAD_ACCOUNT_SUCCESS')<AccountResponse>()
export const accountLoadFailure = createStandardAction('LOAD_ACCOUNT_FAILURE')<Error>()

export const accountIsLoading = createAction('ACCOUNT_IS_LOADING')
export const updateAccountName = createStandardAction('UPDATE_ACCOUNT_NAME')<{
  existingName: string
  newName: string
}>()
export const setActiveAccount = createStandardAction('SET_ACTIVE_ACCOUNT')<{
  targetAccount: PersistedAccount
  accounts: PersistedAccount[]
}>()

export const lockAllAccounts = createAction('LOCK_ALL_ACCOUNTS')
