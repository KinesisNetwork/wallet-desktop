import { App } from './app'
import './fonts/fontawesome-all.min.js'
import './style.scss'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { register } from 'tsconfig-paths'
const config = require('../tsconfig.json')

register({
  baseUrl: config.compilerOptions.baseUrl,
  paths: config.compilerOptions.paths,
})

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById('App'),
  )
}

render()
