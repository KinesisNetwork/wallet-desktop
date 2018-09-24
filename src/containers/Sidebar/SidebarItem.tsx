import * as React from 'react'
import { NavLink } from 'react-router-dom'

interface Props {
  title: string
  to: string
  icon: string
}
export const SidebarItem: React.SFC<Props> = ({ icon, title, to }) => (
  <div className="sidebar-item tile is-child">
    <NavLink
      activeClassName="is-active"
      className="button is-radiusless is-fullwidth is-shadowless"
      to={to}
    >
      <div className="icon is-medium">
        <i className={`fal fa-lg fa-${icon}`} />
      </div>
      <div>{title}</div>
    </NavLink>
  </div>
)
