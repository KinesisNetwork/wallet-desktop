import { AccountPage } from '@types'
import { buildAction } from 'typesafe-actions'

export const setAccountPage = buildAction('SET_ACCOUNT_PAGE').payload<AccountPage>()
