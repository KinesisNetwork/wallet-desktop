import { applyMiddleware, compose, createStore, Dispatch } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { persistReducer, persistStore } from 'redux-persist'

import { createStorage } from '@services/storage'
import { RootAction } from './root-action'
import { epicDependencies, EpicDependencies, rootEpic, RootEpic } from './root-epic'
import { rootReducer, RootState } from './root-reducer'

export type Dispatch = Dispatch<RootAction>

export { RootAction, RootEpic, RootState }

export function configureStore() {
  const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState, EpicDependencies>({
    dependencies: epicDependencies,
  })

  const storage = createStorage()
  const persistedReducer = persistReducer(
    { key: 'root', storage, whitelist: ['wallets', 'payees'] },
    rootReducer,
  )

  const w = window as any
  const composeEnhancers = w.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(epicMiddleware)))
  const persistor = persistStore(store)

  epicMiddleware.run(rootEpic)

  return { store, persistor }
}
