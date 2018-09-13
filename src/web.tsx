import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './fonts/fontawesome-all.min.js'
import './style.scss'

import { App } from './app'

import { register } from 'tsconfig-paths'

// tslint:disable-next-line:no-var-requires no-require-imports
const config = require('../tsconfig.json')

register({
  baseUrl: config.compilerOptions.baseUrl,
  paths: config.compilerOptions.paths,
})

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('App'))
}

renderApp()
