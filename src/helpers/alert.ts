import { transactionErrorCodeToMessage } from '@services/kinesis'
import { get } from 'lodash'
import { focus } from './focus'

export async function formAlert(message: string, key: string) {
  await sweetAlert('Oops!', message, 'error')
  focus(key)
}

export async function generalFailureAlert(message: string) {
  return sweetAlert('Oops!', message, 'error')
}

export async function generalSuccessAlert(message: string) {
  return sweetAlert('Success', message, 'success')
}

export async function transferFailureAlert(failedTxPayload: any) {
  const txErrorCode = get(failedTxPayload, 'data.extras.result_codes.transaction', 'unknown_error')
  const opErrorCode = get(failedTxPayload, 'data.extras.result_codes.operations[0]', 'unknown_error')
  const errorMessage = transactionErrorCodeToMessage(txErrorCode, opErrorCode)
  return sweetAlert('Oops!', errorMessage, 'error')
}
