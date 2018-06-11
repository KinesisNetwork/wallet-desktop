import { buildAction } from 'typesafe-actions'

export const setAccountPage = buildAction('LOAD_ACCOUNT_REQUEST').payload<string>()
