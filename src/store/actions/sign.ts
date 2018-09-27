import { createAction, createStandardAction } from 'typesafe-actions'

import { FormUpdate, RawMessage, SignBehaviour, SignedMessage } from '@types'

export const changeSignFocus = createStandardAction('CHANGE_SIGN_FOCUS')<SignBehaviour>()
export const clearSignForms = createAction('CLEAR_SIGN_FORMS')
export const signMessage = createStandardAction('SIGN_MESSAGE')<string>()
export const updateSignForm = createStandardAction('UPDATE_SIGN_FORM')<FormUpdate<RawMessage>>()
export const messageVerificationResult = createStandardAction('VERIFY_MESSAGE')<boolean>()
export const updateVerifyForm = createStandardAction('UPDATE_VERIFY_FORM')<
  FormUpdate<SignedMessage>
>()

export const updateSignTransactionForm = createStandardAction('UPDATE_SIGN_TRANSACTION_FROM')<
  FormUpdate<RawMessage>
>()
