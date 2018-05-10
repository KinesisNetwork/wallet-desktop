import { addWallet, changeView } from '@actions'
import { RootAction } from '@store'
import { View } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface ViewState {
  readonly currentView: View
}

export const view = combineReducers<ViewState, RootAction>({
  currentView: (state = View.create, action) => {
    switch (action.type) {
      case getType(changeView): return action.payload
      case getType(addWallet): return View.dashboard
      default: return state
    }
  },
})
