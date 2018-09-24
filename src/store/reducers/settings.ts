import { completeOnBoarding } from '@actions'
import { RootAction } from '@store'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface SettingsState {
  readonly onBoarding: boolean
}

export const settings = combineReducers<SettingsState, RootAction>({
  onBoarding: (state = false, action) => {
    switch (action.type) {
      case getType(completeOnBoarding):
        return true
      default:
        return state
    }
  },
})
