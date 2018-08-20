import * as React from 'react'

import { ConnectionForm } from '@containers/ConnectionForm'
import { ConnectionSelector } from '@containers/ConnectionSelector'

export const ConnectionSettings: React.SFC = () => (
  <div className='vertical-spaced has-text-centered'>
    <h1 className='title-heading'>Manage Connections</h1>
    <div className='columns'>
      <div className='column'>
        <ConnectionSelector />
      </div>
      <div className='column'>
        <ConnectionForm />
      </div>
    </div>
  </div>
)

ConnectionSettings.displayName = 'ConnectionSettings'
