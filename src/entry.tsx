require('./style.css')
require('./fonts/fontawesome-all.js')
const { App } = require('./app')

if (!process.env.IS_WEB) {
  const w: any = window
  w.exports = module.exports
}

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import { register } from 'tsconfig-paths'
const config = require('../tsconfig.json')

register({
  baseUrl: config.compilerOptions.baseUrl,
  paths: config.compilerOptions.paths,
})

let render = () => {
  ReactDOM.render(<AppContainer><App /></AppContainer>, document.getElementById('App'))
}

render()

if (!process.env.IS_WEB) {
  const m: any = module
  if (m.hot) { m.hot.accept(render) }
}
