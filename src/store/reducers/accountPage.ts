import { setAccountPage } from '@actions'
import { RootAction } from '@store'
import { AccountPage } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface AccountPageState {
  readonly accountPage: string
}

export const accountPage = combineReducers<AccountPageState, RootAction>({
  accountPage: (state = AccountPage.transfer, action) => {
    switch (action.type) {
      case getType(setAccountPage): return action.payload
      default: return state
    }
  },
})
