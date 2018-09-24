import { addContact, removeContact } from '@actions'
import { RootAction } from '@store'
import { Contact } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface ContactState {
  contactList: Contact[]
  newContact: Contact
}

export const contacts = combineReducers<ContactState, RootAction>({
  contactList: (state = [], action) => {
    switch (action.type) {
      case getType(addContact):
        return [...state, action.payload]
      case getType(removeContact):
        return state.filter(contact => contact.address !== action.payload.address)
      default:
        return state
    }
  },
  newContact: (state = { name: '', address: '' }, action) => {
    switch (action.type) {
      default:
        return state
    }
  },
})
