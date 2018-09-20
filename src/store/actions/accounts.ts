import { WalletAccount } from '@types'
import { AccountResponse } from 'js-kinesis-sdk'
import { buildAction } from 'typesafe-actions'

export const accountLoadRequest = buildAction('LOAD_ACCOUNT_REQUEST').payload<string>()
export const accountLoadSuccess = buildAction('LOAD_ACCOUNT_SUCCESS').payload<AccountResponse>()
export const accountLoadFailure = buildAction('LOAD_ACCOUNT_FAILURE').payload<Error>()

export const accountIsLoading = buildAction('ACCOUNT_IS_LOADING').empty()
export const updateAccountName = buildAction('UPDATE_ACCOUNT_NAME').payload<{existingName: string, newName: string}>()
export const setActiveAccount = buildAction('SET_ACTIVE_ACCOUNT').payload<{targetAccount: WalletAccount, accounts: WalletAccount[]}>()

export const lockAllAccounts = buildAction('LOCK_ALL_ACCOUNTS').empty()
