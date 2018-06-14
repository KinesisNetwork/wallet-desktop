import { FormUpdate, Payee } from '@types'
import { buildAction } from 'typesafe-actions'

export const addPayee = buildAction('SET_PAYEE').payload<Payee>()
export const removePayee = buildAction('REMOVE_PAYEE').payload<string>()
export const updatePayeeForm = buildAction('UPDATE_PAYEE_FORM').payload<FormUpdate<Payee>>()
export const loadPayees = buildAction('LOAD_PAYEES').payload<Payee[]>()
