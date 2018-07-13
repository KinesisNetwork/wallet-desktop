import { buildAction } from 'typesafe-actions'

import { FormUpdate, RawMessage, SignBehaviour, SignedMessage } from '@types'

export const changeSignFocus = buildAction('CHANGE_SIGN_FOCUS').payload<SignBehaviour>()
export const clearSignForms = buildAction('CLEAR_SIGN_FORMS').empty()
export const signMessage = buildAction('SIGN_MESSAGE').payload<string>()
export const updateSignForm = buildAction('UPDATE_SIGN_FORM').payload<FormUpdate<RawMessage>>()
export const messageVerificationResult = buildAction('VERIFY_MESSAGE').payload<boolean>()
export const updateVerifyForm = buildAction('UPDATE_VERIFY_FORM').payload<
  FormUpdate<SignedMessage>
>()

export const updateSignTransactionForm = buildAction('UPDATE_SIGN_TRANSACTION_FROM').payload<
  FormUpdate<RawMessage>
>()
