import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './fonts/fontawesome-all.min.js'
import './style.scss'

import { App } from './app'

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('App'))
}

renderApp()
