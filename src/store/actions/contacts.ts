import { Contact, FormUpdate } from '@types'
import { buildAction } from 'typesafe-actions'

export const addContact = buildAction('ADD_CONTACT').payload<Contact>()
export const removeContact = buildAction('REMOVE_CONTACT').payload<Pick<Contact, 'address'>>()
export const updateContactForm = buildAction('UPDATE_CONTACT_FORM').payload<FormUpdate<Contact>>()
