import { closeModal } from '@actions'
import { RootAction } from '@store'
import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';

export interface ModalState {
  readonly modalDisplay: boolean
}

export const modals = combineReducers<ModalState, RootAction>({
  modalDisplay: (state = true, action) => {
    switch (action.type) {
      case getType(closeModal):
        return false
      default:
        return state
    }
  }
})
