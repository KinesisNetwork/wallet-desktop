import { buildAction } from 'typesafe-actions'

export const transferRequest = buildAction('TRANSFER_REQUEST').payload<>()
