import { applyMiddleware, createStore, Dispatch } from 'redux'
import { createEpicMiddleware, Epic } from 'redux-observable'
import { RootAction } from './root-action'
import { rootEpic, rootReducer, RootState } from './root-reducer'

const epicMiddleware = createEpicMiddleware(rootEpic)

export type Dispatch = Dispatch<RootAction>
export type Epic = Epic<RootAction, RootState>
export { RootAction, RootState }

export const store = createStore(rootReducer, applyMiddleware(epicMiddleware))
