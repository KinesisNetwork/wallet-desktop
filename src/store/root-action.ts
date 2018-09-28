import { REHYDRATE } from 'redux-persist'
import { ActionType } from 'typesafe-actions'

import * as actions from './actions'
import { RootState } from './root-reducer'

export interface RehydrateAction {
  type: typeof REHYDRATE
  payload: RootState
  key: string
}

export type RootAction = ActionType<typeof actions> | RehydrateAction
