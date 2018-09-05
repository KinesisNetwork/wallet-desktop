import { RootRoutes } from '@types'
import * as React from 'react'
import { NavLink, RouteComponentProps } from 'react-router-dom'

export interface Props {
  connectionName: string
}

const SidebarSettings: React.SFC<Props & RouteComponentProps<any>> = ({ connectionName }) => (
  <div className="has-text-centered vertical-spaced" style={{ justifyContent: 'flex-end' }}>
    <label className="label is-small is-capitalized">Connection: {connectionName}</label>
    <NavLink to={RootRoutes.settings} className="button is-fullwidth" activeClassName="is-active">
      Settings
    </NavLink>
    <p className="is-size-4 has-text-primary" style={{ marginTop: '1rem' }}>
      Kinesis Wallet - alpha
    </p>
  </div>
)

export { SidebarSettings }
