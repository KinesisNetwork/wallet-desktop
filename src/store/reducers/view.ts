import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'
import { RootAction } from '@store'
import { changeView } from '@actions'
import { View } from '@types'
import { ViewState } from '../state/view'

export const view = combineReducers<ViewState, RootAction>({
  currentView: (state = View.create, action) => {
    switch (action.type) {
      case getType(changeView):
        return action.payload
      default: return state
    }
  },
})
