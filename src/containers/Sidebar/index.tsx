import { push } from 'connected-react-router'
import * as React from 'react'
import SVG from 'react-inlinesvg'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

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
import { PersistedAccount, RootRoutes } from '@types'
import * as logo from 'images/KinesisIcon.svg'

export const mapStateToProps = ({ wallet }: RootState) => ({
  activeAccount: getActiveAccount(wallet),
  accounts: wallet.persisted.createdAccounts,
})

export const mapDispathToProps = { addNextAccountFromSeedphrase, setActiveAccount, push }

type Props = typeof mapDispathToProps &
  ReturnType<typeof mapStateToProps> &
  RouteComponentProps<any>

export class SidebarPresentation extends React.Component<Props> {
  public dropdownAccounts = handleToggle =>
    this.props.accounts.map(a => (
      <DropdownItem
        key={a.name}
        titleClassName="has-text-weight-bold"
        title={a.name}
        isActive={this.props.activeAccount.name === a.name}
        isImport={a.imported}
        onClick={() => {
          this.setAccount(a)
          handleToggle()
        }}
      />
    ))

  public setAccount = (account: PersistedAccount) => {
    this.props.setActiveAccount({ targetAccount: account, accounts: this.props.accounts })
  }

  public addAccount = () => this.props.addNextAccountFromSeedphrase()

  public importAccount = () => this.props.push(RootRoutes.importAccount)

  render() {
    return (
      <nav className="sidebar tile is-ancestor is-vertical">
        <SidebarUpper>
          <div className="sidebar-header tile is-parent is-vertical">
            <div className="tile is-child has-text-centered">
              <SVG src={logo} className="sidebar-logo" />
              <p className="has-text-primary" />
            </div>

            <SidebarDropdown>
              {({ isExpanded, handleToggle }) => (
                <React.Fragment>
                  <DropdownTrigger
                    key="trigger"
                    isExpanded={isExpanded}
                    onClick={handleToggle}
                    title={this.props.activeAccount.name}
                  />
                  <DropdownMenu key="menu">
                    <React.Fragment>{this.dropdownAccounts(handleToggle)}</React.Fragment>
                    <DropdownDivider />
                    <DropdownItem
                      title="Add Account"
                      icon="plus-circle"
                      onClick={this.addAccount}
                    />
                    <DropdownDivider />
                    <DropdownItem
                      title="Import Account"
                      icon="download"
                      onClick={this.importAccount}
                    />
                  </DropdownMenu>
                </React.Fragment>
              )}
            </SidebarDropdown>
          </div>

          <div className="sidebar-list tile is-parent is-vertical">
            <SidebarItem title="My Money" to={RootRoutes.dashboard} icon="wallet" />
            <SidebarItem title="Contacts" to={RootRoutes.contacts} icon="address-book" />
            {/* <SidebarItem title="Exchange" to={RootRoutes.exchange} icon="chart-line" /> */}
          </div>
        </SidebarUpper>
        <SidebarLower>
          <SidebarLowerItem icon="sliders-v" hint="settings" to={RootRoutes.settings} />
          <SidebarLowerItem
            hint="help"
            icon="question-circle"
            to="#"
            onClick={() =>
              (location.href =
                'mailto:marketing@kinesis.money?subject=Kinesis%20wallet%20help%20request&bcc=it@kinesis.money')
            }
          />
          <SidebarLowerItem
            icon="sign-out-alt"
            hint="logout"
            to="#"
            onClick={() => location.reload()}
          />
        </SidebarLower>
      </nav>
    )
  }
}

export const Sidebar = withRouter(
  connect(
    mapStateToProps,
    mapDispathToProps,
  )(SidebarPresentation),
)
