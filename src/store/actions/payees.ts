import { Contact } from '@types'
import { buildAction } from 'typesafe-actions'

export const addContact = buildAction('ADD_CONTACT').payload<Contact>()
export const removeContact = buildAction('REMOVE_CONTACT').payload<string>()
