import * as React from 'react'
import { connect } from 'react-redux'

import { addNextAccountFromSeedphrase, setActiveAccount } from '@actions'
import { DropdownDivider } from '@containers/Sidebar/DropdownDivider'
import { DropdownItem } from '@containers/Sidebar/DropdownItem'
import { DropdownMenu } from '@containers/Sidebar/DropdownMenu'
import { DropdownTrigger } from '@containers/Sidebar/DropdownTrigger'
import { SidebarDropdown } from '@containers/Sidebar/SidebarDropdown'
import { SidebarItem } from '@containers/Sidebar/SidebarItem'
import { SidebarLower, SidebarLowerItem } from '@containers/Sidebar/SidebarLower'
import { SidebarUpper } from '@containers/Sidebar/SidebarUpper'
import { getActiveAccount } from '@selectors'
import { RootState } from '@store'
import { RootRoutes, WalletAccount } from '@types'

let logo
if (process.env.IS_WEB) {
  logo = require('../../icons/png/64x64.png')
}

export const mapStateToProps = ({ wallet }: RootState) => ({
  activeAccount: getActiveAccount(wallet),
  accounts: wallet.accounts,
})

export const mapDispathToProps = { addNextAccountFromSeedphrase, setActiveAccount }

type Props = typeof mapDispathToProps & ReturnType<typeof mapStateToProps>

export class SidebarPresentation extends React.Component<Props> {
  public dropDownAccounts

  public dropdownAccounts = () => this.props.accounts.map(a => <DropdownItem
    key={a.name}
    titleClassName="has-text-weight-bold"
    title={a.name}
    isActive={this.props.activeAccount.name === a.name}
    onClick={() => this.setAccount(a)}
  />)

  public setAccount = (account: WalletAccount) => {
    this.props.setActiveAccount({targetAccount: account, accounts: this.props.accounts})
  }

  public addAccount = () => this.props.addNextAccountFromSeedphrase()

  render() {
    return (
      <nav className="sidebar tile is-ancestor vertical-spaced">
        <SidebarUpper>
          <div className="sidebar-header tile is-parent is-vertical">
            <div className="tile is-child has-text-centered">
              <img src={logo ? logo : './icons/png/64x64.png'} className="sidebar-logo" alt="Logo alpha" />
              <p className="has-text-primary">100.00 KINESIS</p>
            </div>

            <SidebarDropdown>
              {({ isExpanded, handleToggle }) => (
                <React.Fragment>
                  <DropdownTrigger key="trigger" isExpanded={isExpanded} onClick={handleToggle} title={this.props.activeAccount.name} />
                  <DropdownMenu key="menu">
                    <React.Fragment>{this.dropdownAccounts()}</React.Fragment>
                    <DropdownDivider />
                    <DropdownItem title="Add Account" icon="plus-circle" onClick={this.addAccount} />
                    <DropdownDivider />
                    <DropdownItem title="Import Account" icon="download" />
                  </DropdownMenu>
                </React.Fragment>
              )}
            </SidebarDropdown>
          </div>

          <div className="sidebar-list tile is-parent is-vertical">
            <SidebarItem title="My Money" to={RootRoutes.dashboard} icon="wallet" />
            <SidebarItem title="Contacts" to={RootRoutes.addressBook} icon="address-book" />
            <SidebarItem title="Exchange" to="/exchange" icon="chart-line" />
          </div>
        </SidebarUpper>
        <SidebarLower>
          <SidebarLowerItem icon="sliders-v" hint="settings" to={RootRoutes.settings} />
          <SidebarLowerItem icon="question-circle" hint="help" to="#" />
          <SidebarLowerItem icon="sign-out-alt" hint="logout" to={RootRoutes.dashboard} />
        </SidebarLower>
      </nav>
    )
  }
}

export const Sidebar = connect(mapStateToProps, mapDispathToProps)(SidebarPresentation)
