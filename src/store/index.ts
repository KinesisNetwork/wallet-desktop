import { createStore, Store } from 'redux'
import { rootReducer } from './root-reducer'
import { RootState } from './state'
import { RootAction } from './root-action'

export { RootAction } from './root-action'
export { RootState } from './state'

export const store: Store<RootState, RootAction> = createStore(rootReducer)
