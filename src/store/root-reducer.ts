import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import { RootAction } from './root-action'
import * as reducers from './reducers'
import * as epics from './epics'
import { Epic } from '@store'

export type RootState = {
  [P in keyof typeof reducers]: ReturnType<typeof reducers[P]>
}
export const rootReducer = combineReducers<RootState, RootAction>(reducers)
export const rootEpic = combineEpics<Epic>(epics.loadAccount$)
