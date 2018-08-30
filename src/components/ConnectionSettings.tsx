import * as React from 'react'

import { ConnectionForm } from '@containers/ConnectionForm'
import { ConnectionSelector } from '@containers/ConnectionSelector'

export const ConnectionSettings: React.SFC = () => (
  <div className="vertical-spaced">
    <h1 className="title-heading has-text-centered">Manage Connections</h1>
    <div className="columns">
      <div className="column">
        <section className="section">
          <ConnectionSelector />
        </section>
      </div>
      <div className="column">
        <ConnectionForm />
      </div>
    </div>
  </div>
)

ConnectionSettings.displayName = 'ConnectionSettings'
