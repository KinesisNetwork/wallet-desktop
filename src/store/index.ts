import { createStore, Dispatch, Store } from 'redux'
import { rootReducer, RootState } from './root-reducer'
import { RootAction } from './root-action'

export type Dispatch = Dispatch<RootAction>
export { RootAction, RootState }
export const store: Store<RootState, RootAction> = createStore(rootReducer)
