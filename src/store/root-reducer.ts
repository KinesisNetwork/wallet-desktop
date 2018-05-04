import { combineReducers } from 'redux'
// @ts-ignore
import * as types from '@types'
import { RootAction } from './root-action'
import { RootState } from './state'
import * as reducers from './reducers'

export const rootReducer = combineReducers<RootState, RootAction>(reducers)
