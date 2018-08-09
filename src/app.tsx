import * as React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { Main } from '@containers/Main'
import { configureStore } from './store'

const { store, persistor } = configureStore()

export const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Main />
    </PersistGate>
  </Provider>
)
