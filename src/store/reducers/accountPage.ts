import { selectWallet, setAccountPage } from '@actions'
import { RootAction } from '@store'
import { AccountPage } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface AccountPageState {
  readonly accountPage: AccountPage
}

export const accountPage = combineReducers<AccountPageState, RootAction>({
  accountPage: (state = AccountPage.dashboard, action) => {
    switch (action.type) {
      case getType(setAccountPage): return action.payload
      case getType(selectWallet): return AccountPage.dashboard
      default: return state
    }
  },
})
