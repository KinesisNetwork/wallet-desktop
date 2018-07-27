import { messageVerificationResult } from '@actions'
import { generalFailureAlert, generalSuccessAlert } from '@helpers/alert'
import { Epic } from '@store'
import { filter, ignoreElements, map } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

const SUCCESS_MESSAGE = 'The signature is valid'
const FAILURE_MESSAGE =
  'The verification request is invalid. Ensure you have the correct message, signature and public key.'

export const verificationNotification$: Epic = action$ =>
  action$.pipe(
    filter(isActionOf(messageVerificationResult)),
    map(
      ({ payload: isValid }) =>
        isValid ? generalSuccessAlert(SUCCESS_MESSAGE) : generalFailureAlert(FAILURE_MESSAGE),
    ),
    ignoreElements(),
  )
