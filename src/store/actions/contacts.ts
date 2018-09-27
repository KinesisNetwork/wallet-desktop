import { Contact, FormUpdate } from '@types'
import { createStandardAction } from 'typesafe-actions'

export const addContact = createStandardAction('ADD_CONTACT')<Contact>()
export const removeContact = createStandardAction('REMOVE_CONTACT')<Pick<Contact, 'address'>>()
export const updateContactForm = createStandardAction('UPDATE_CONTACT_FORM')<FormUpdate<Contact>>()
