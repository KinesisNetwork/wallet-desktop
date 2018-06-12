import { createStorage } from '@services/storage'
import { applyMiddleware, compose, createStore, Dispatch } from 'redux'
import { createEpicMiddleware, Epic } from 'redux-observable'
import { persistReducer, persistStore, REHYDRATE } from 'redux-persist'
import { RootAction } from './root-action'
import { rootEpic, rootReducer, RootState } from './root-reducer'

export type Dispatch = Dispatch<RootAction>
const RehydrateAction = { type: REHYDRATE }
export type Epic = Epic<RootAction | typeof RehydrateAction, RootState>
export { RootAction, RootState }

export function configureStore() {
  const epicMiddleware = createEpicMiddleware(rootEpic)

  const persistedReducer = persistReducer({ key: 'root', storage: createStorage() }, rootReducer)

  const w = window as any
  const composeEnhancers = w.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(epicMiddleware)))
  const persistor = persistStore(store)

  return { store, persistor }
}
