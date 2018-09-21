import * as React from 'react'

import { DropdownDivider } from '@containers/Sidebar/DropdownDivider'
import { DropdownItem } from '@containers/Sidebar/DropdownItem'
import { DropdownMenu } from '@containers/Sidebar/DropdownMenu'
import { DropdownTrigger } from '@containers/Sidebar/DropdownTrigger'
import { SidebarDropdown } from '@containers/Sidebar/SidebarDropdown'
import { SidebarItem } from '@containers/Sidebar/SidebarItem'
import { SidebarLower, SidebarLowerItem } from '@containers/Sidebar/SidebarLower'
import { SidebarUpper } from '@containers/Sidebar/SidebarUpper'
import { RootRoutes } from '@types'
import { withRouter } from 'react-router'

let logo
if (process.env.IS_WEB) {
  logo = require('../../icons/png/64x64.png')
}

export const SidebarPresentation: React.SFC = () => (
  <nav className="sidebar tile is-ancestor is-vertical">
    <SidebarUpper>
      <div className="sidebar-header tile is-parent is-vertical">
        <div className="tile is-child has-text-centered">
          <img
            src={logo ? logo : './icons/png/64x64.png'}
            className="sidebar-logo"
            alt="Logo alpha"
          />
          <p className="has-text-primary">100.00 KINESIS</p>
        </div>

        <SidebarDropdown>
          {({ isExpanded, handleToggle }) => (
            <React.Fragment>
              <DropdownTrigger
                key="trigger"
                isExpanded={isExpanded}
                onClick={handleToggle}
                title="Samuello B"
              />
              <DropdownMenu key="menu">
                {/* Map the available accounts into DropdownItems */}
                <DropdownItem
                  titleClassName="has-text-weight-bold"
                  title="Account 1"
                  subtitle="$1.00 AUD"
                  isActive={true}
                />
                <DropdownItem
                  titleClassName="has-text-weight-bold"
                  title="Account 2"
                  subtitle="$2.00 AUD"
                />
                <DropdownItem titleClassName="has-text-weight-bold" title="Account 3" />
                <DropdownDivider />
                <DropdownItem title="Add Account" icon="plus-circle" />
                <DropdownDivider />
                <DropdownItem title="Import Account" icon="download" />
              </DropdownMenu>
            </React.Fragment>
          )}
        </SidebarDropdown>
      </div>

      <div className="sidebar-list tile is-parent is-vertical">
        <SidebarItem title="My Money" to={RootRoutes.dashboard} icon="wallet" />
        <SidebarItem title="Contacts" to={RootRoutes.contacts} icon="address-book" />
        <SidebarItem title="Exchange" to="/exchange" icon="chart-line" />
      </div>
    </SidebarUpper>
    <SidebarLower>
      <SidebarLowerItem icon="sliders-v" hint="settings" to={RootRoutes.settings} />
      <SidebarLowerItem icon="question-circle" hint="help" to="#" />
      <SidebarLowerItem icon="sign-out-alt" hint="logout" to="#" />
    </SidebarLower>
  </nav>
)

export const Sidebar = withRouter(SidebarPresentation)
