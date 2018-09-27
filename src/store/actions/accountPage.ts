import { AccountPage } from '@types'
import { createStandardAction } from 'typesafe-actions'

export const setAccountPage = createStandardAction('SET_ACCOUNT_PAGE')<AccountPage>()
