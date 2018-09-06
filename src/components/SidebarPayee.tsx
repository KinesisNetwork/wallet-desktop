import { RootRoutes } from '@types'
import * as React from 'react'
import { NavLink } from 'react-router-dom'

const SidebarPayee: React.SFC = () => (
  <div className="has-text-centered">
    <NavLink
      to={RootRoutes.addressBook}
      className="button is-outlined is-fullwidth"
      activeClassName="is-active"
    >
      Manage Payees
    </NavLink>
  </div>
)

export { SidebarPayee }
