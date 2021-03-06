import { connectRouter, routerMiddleware } from 'connected-react-router'
import { History } from 'history'
import { applyMiddleware, compose, createStore, Dispatch } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { persistReducer, persistStore } from 'redux-persist'

import { createStorage } from '@services/storage'
import { RootAction } from './root-action'
import { epicDependencies, EpicDependencies, rootEpic, RootEpic } from './root-epic'
import { rootReducer, RootState } from './root-reducer'

export type Dispatch = Dispatch<RootAction>

export { RootAction, RootEpic, RootState }

export const IS_DEV = true && process.env.NODE_ENV !== 'production'

export function configureStore(history: History) {
  const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState, EpicDependencies>({
    dependencies: epicDependencies,
  })

  const fullReducer = connectRouter(history)(rootReducer)
  const storage = createStorage()

  const reducerWhitelist = ['contacts', 'connections', 'settings']
  const persistedReducer = IS_DEV
    ? persistReducer({ key: 'dev', storage, blacklist: ['transactions', 'wallet'] }, fullReducer)
    : persistReducer({ key: 'root', storage, whitelist: reducerWhitelist }, fullReducer)

  const w = window as any
  const composeEnhancers = w.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(routerMiddleware(history), epicMiddleware)),
  )
  const persistor = persistStore(store)

  epicMiddleware.run(rootEpic)

  return { store, persistor }
}
