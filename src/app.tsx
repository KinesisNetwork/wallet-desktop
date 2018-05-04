import * as React from 'react'
import { Provider } from 'react-redux'
import { App as Main } from '@components'
import { store } from '@store'

// Currently @types/react-redux is not compatible with nice TS types in redux@4
export const App = () => (
  <Provider store={store as any}>
    <Main />
  </Provider>
)
