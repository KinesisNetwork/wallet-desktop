import { FormUpdate, TransferRequest } from '@types'
import { buildAction } from 'typesafe-actions'

export const transferRequest = buildAction('TRANSFER_REQUEST').payload<TransferRequest>()
export const transferSuccess = buildAction('TRANSFER_SUCCESS').payload<string>()
export const transferFailed = buildAction('TRANSFER_FAILED').payload<Error>()
export const updateTransferForm = buildAction('UPDATE_TRANSFER_FORM').payload<FormUpdate<TransferRequest>>()
