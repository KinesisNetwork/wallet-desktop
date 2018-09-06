import { combineReducers } from 'redux'

import { RouterState } from 'connected-react-router'
import * as reducers from './reducers'
import { GetAction, RootAction } from './root-action'

export type CreateReducerMap = {
  readonly [T in RootAction['type']]: (state, action: GetAction<T>) => typeof state
}
type ReducersState = { [P in keyof typeof reducers]: ReturnType<typeof reducers[P]> }
export const rootReducer = combineReducers<ReducersState, RootAction>(reducers)
export type RootState = ReducersState & { router: RouterState }
