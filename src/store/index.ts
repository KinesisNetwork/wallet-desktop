import { applyMiddleware, compose, createStore, Dispatch } from 'redux'
import { createEpicMiddleware, Epic } from 'redux-observable'
import { persistReducer, persistStore, REHYDRATE } from 'redux-persist'

import { generalFailureAlert, generalSuccessAlert } from '@helpers/alert'
import { loadAccount } from '@services/accounts'
import { getTransactionErrorMessage } from '@services/kinesis'
import { createStorage } from '@services/storage'
import { createKinesisTransfer, submitSignedTransaction } from '@services/transfer'
import { RootAction } from './root-action'
import { rootEpic, rootReducer, RootState } from './root-reducer'
import { getActiveKeys, getCurrentConnection } from './selectors'

export type Dispatch = Dispatch<RootAction>
    export interface RehydrateAction {
      type: typeof REHYDRATE
      payload: RootState
    }
export type OurEpic = Epic<RootAction | RehydrateAction, RootAction | RehydrateAction, RootState, any>
export { RootAction, RootState }

export function configureStore() {
  const epicMiddleware = createEpicMiddleware<
    RootAction | RehydrateAction,
    RootAction | RehydrateAction,
    RootState, any
  >({
    dependencies: {
      createKinesisTransfer,
      generalFailureAlert,
      generalSuccessAlert,
      getCurrentConnection,
      getActiveKeys,
      getTransactionErrorMessage,
      loadAccount,
      submitSignedTransaction,
    },
  })

  const storage = createStorage()
  const persistedReducer = persistReducer(
    { key: 'root', storage, blacklist: ['passwords'] },
    rootReducer,
  )

  const w = window as any
  const composeEnhancers = w.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(epicMiddleware)))
  const persistor = persistStore(store)

  epicMiddleware.run(rootEpic)

  return { store, persistor }
}
