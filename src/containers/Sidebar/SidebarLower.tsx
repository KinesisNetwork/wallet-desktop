import * as React from 'react'
import { NavLink } from 'react-router-dom'

interface SidebarLowerItemProps {
  hint: string
  icon: string
  to: string
}
export const SidebarLowerItem: React.SFC<SidebarLowerItemProps> = ({ icon, hint, to }) => (
  <NavLink activeClassName="is-active" className="sidebar-lower-item button is-shadowless" to={to} title={hint}>
    <span className="icon is-large">
      <i className={`fal fa-lg fa-${icon}`} />
    </span>
  </NavLink>
)

interface SidebarLowerProps {
  children: JSX.Element[]
}
export const SidebarLower: React.SFC<SidebarLowerProps> = ({ children }) => (
  <div className="sidebar-lower tile is-parent">
    <div className="sidebar-lower-item-list tile is-child">
      {children}
    </div>
  </div>
)