import * as React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { Notifier } from '@containers/Notifier'
import { Routing } from '@containers/Routing'
import { ConnectedRouter } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { configureStore } from './store'

const history = createBrowserHistory()
const { store, persistor } = configureStore(history)

export const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ConnectedRouter history={history}>
        <div>
          <Notifier />
          <Routing />
        </div>
      </ConnectedRouter>
    </PersistGate>
  </Provider>
)
