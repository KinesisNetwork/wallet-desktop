import { combineReducers } from 'redux'
import { RootAction } from './root-action'
import * as reducers from './reducers'

export type RootState = {
  [P in keyof typeof reducers]: ReturnType<typeof reducers[P]>
}
export const rootReducer = combineReducers<RootState, RootAction>(reducers)
