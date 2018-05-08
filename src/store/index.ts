import { createStore, applyMiddleware, Dispatch, } from 'redux'
import { createEpicMiddleware, Epic } from 'redux-observable'
import { rootEpic, rootReducer, RootState } from './root-reducer'
import { RootAction } from './root-action'

const epicMiddleware = createEpicMiddleware(rootEpic)

export type Dispatch = Dispatch<RootAction>
export type Epic = Epic<RootAction, RootState>
export { RootAction, RootState }

export const store = createStore(rootReducer, applyMiddleware(epicMiddleware))
