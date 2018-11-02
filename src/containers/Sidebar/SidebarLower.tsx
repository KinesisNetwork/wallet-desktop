import * as React from 'react'
import { NavLink } from 'react-router-dom'

interface SidebarLowerItemProps {
  hint: string
  icon: string
  to: string
  onClick?: React.MouseEventHandler
}
export const SidebarLowerItem: React.SFC<SidebarLowerItemProps> = ({ icon, hint, to, onClick }) => (
  <NavLink
    activeClassName="is-active"
    className="sidebar-lower-item button is-shadowless"
    to={to}
    title={hint}
    onClick={onClick}
    exact={true}
  >
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
    <div className="sidebar-lower-item-list tile is-child">{children}</div>
  </div>
)
