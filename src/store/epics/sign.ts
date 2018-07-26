import { messageVerificationResult } from '@actions'
import { generalFailureAlert, generalSuccessAlert } from '@helpers/alert'
import { Epic } from '@store'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { filter, ignoreElements, map } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

export const verificationNotification$: Epic = action$ =>
  action$.pipe(
    filter(isActionOf(messageVerificationResult)),
    map(({ payload }) => {
      if (payload) {
        return fromPromise(generalSuccessAlert('The signature is valid.'))
      }

      return fromPromise(
        generalFailureAlert(
          'The verification request is invalid. Ensure you have the correct message, signature and public key.',
        ),
      )
    }),
    ignoreElements(),
  )
