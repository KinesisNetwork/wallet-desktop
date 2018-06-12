import { Main } from '@containers'
import { configureStore } from '@store'
import * as React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

const { store, persistor } = configureStore()

export const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Main />
    </PersistGate>
  </Provider>
)
