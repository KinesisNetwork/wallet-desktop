import { View } from '@types'
import * as React from 'react'

export interface Props {
  connectionName: string
  changeView: (view: View) => any
}

export const SidebarSettings: React.SFC<Props> = ({connectionName, changeView}) => (
  <div className='has-text-centered vertical-spaced' style={{ justifyContent: 'flex-end' }}>
    <label className='label'> Connection: {connectionName} </label>
    <button className='button is-outlined is-fullwidth' onClick={() => changeView(View.settings)}>
      Settings
    </button>
  </div>
)
