import { FormUpdate, Payee } from '@types'
import { buildAction } from 'typesafe-actions'

export const setPayee = buildAction('SET_PAYEE').payload<Payee>()
export const updatePayeeForm = buildAction('UPDATE_PAYEE_FORM').payload<FormUpdate<Payee>>()
