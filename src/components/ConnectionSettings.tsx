import * as React from 'react'

import { ConnectionSelector } from '@containers/ConnectionSelector'

export const ConnectionSettings: React.SFC = () => (
  <div className="vertical-spaced">
    <h1 className="title-heading has-text-centered">Manage Connections</h1>
    <div className="columns is-centered">
      <div className="column is-two-thirds">
        <section className="section">
          <ConnectionSelector />
        </section>
      </div>
    </div>
  </div>
)

ConnectionSettings.displayName = 'ConnectionSettings'
