import { Epic } from '@store'
import { values } from 'lodash'
import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import * as epics from './epics'
import * as reducers from './reducers'
import { GetAction, RootAction } from './root-action'

export type CreateReducerMap = {
  readonly [T in RootAction['type']]: (state, action: GetAction<T>) => typeof state
}
export type RootState = {
  [P in keyof typeof reducers]: ReturnType<typeof reducers[P]>
}
export const rootReducer = combineReducers<RootState, RootAction>(reducers)
export const rootEpic = combineEpics<Epic>(...values(epics))
