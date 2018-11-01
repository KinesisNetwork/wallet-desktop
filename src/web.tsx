import 'autotrack/lib/plugins/clean-url-tracker'
import 'autotrack/lib/plugins/event-tracker'
import 'autotrack/lib/plugins/media-query-tracker'
import 'autotrack/lib/plugins/page-visibility-tracker'
import 'autotrack/lib/plugins/url-change-tracker'
import './dependency-inline.js'
import './fonts/fontawesome-all.min.js'
import './style.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fal } from '@fortawesome/pro-light-svg-icons'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { App } from './app'

import { register } from 'tsconfig-paths'

// tslint:disable-next-line:no-var-requires no-require-imports
const config = require('../tsconfig.json')

register({
  baseUrl: config.compilerOptions.baseUrl,
  paths: config.compilerOptions.paths,
})

library.add(fal)

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('App'))
}

renderApp()

import('./jira-issue-collector.js')
