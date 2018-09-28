import { RouterState } from 'connected-react-router'
import { combineReducers } from 'redux'
import { StateType } from 'typesafe-actions'

import * as reducers from './reducers'
import { RootAction } from './root-action'

type ReducersState = StateType<typeof reducers>

export const rootReducer = combineReducers<ReducersState, RootAction>(reducers)
export type RootState = ReducersState & { router: RouterState }
