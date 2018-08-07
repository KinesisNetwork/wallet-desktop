import { combineReducers } from 'redux'

import * as reducers from './reducers'
import { GetAction, RootAction } from './root-action'

export type CreateReducerMap = {
  readonly [T in RootAction['type']]: (state, action: GetAction<T>) => typeof state
}
export type RootState = {
  [P in keyof typeof reducers]: ReturnType<typeof reducers[P]>
}
export const rootReducer = combineReducers<RootState, RootAction>(reducers)
