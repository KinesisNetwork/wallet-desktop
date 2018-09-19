import * as React from 'react'

interface Props {
  children: JSX.Element[]
}
export const DropdownMenu: React.SFC<Props> = ({ children }) => (
  <div className="dropdown-menu is-paddingless" id="dropdown-menu" role="menu">
    <div className="dropdown-content is-paddingless">
      {children}
    </div>
  </div>
)
