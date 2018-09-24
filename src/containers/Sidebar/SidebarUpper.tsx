import * as React from 'react'

interface Props {
  children: JSX.Element[]
}
export const SidebarUpper: React.SFC<Props> = ({ children }) => (
  <div className="sidebar-upper tile">
    <div className="tile is-vertical">{children}</div>
  </div>
)
