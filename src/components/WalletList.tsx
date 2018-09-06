import * as React from 'react'

import { RootRoutes, Wallet } from '@types'
import { NavLink } from 'react-router-dom'

export interface Props {
  wallets: Wallet[]
  activeWallet: Wallet | null
  selectWallet: (wallet: Wallet) => any
  deleteWallet: (wallet: Wallet) => any
  addWallet: () => any
}

class WalletList extends React.Component<Props> {
  constructor(props) {
    super(props)
  }

  renderWallets = () => {
    return this.props.wallets.map(wallet => {
      return (
        <WalletListItem
          key={wallet.publicKey}
          wallet={wallet}
          isActive={
            !!this.props.activeWallet && this.props.activeWallet.publicKey === wallet.publicKey
          }
          selectWallet={this.props.selectWallet}
          deleteWallet={this.props.deleteWallet}
        />
      )
    })
  }

  render() {
    return (
      <nav className="panel">
        <p className="panel-heading wallet-heading">Accounts</p>
        {this.renderWallets()}
        <div className="panel-block">
          <NavLink to={RootRoutes.create} className="button is-primary is-outlined is-fullwidth">
            Add Account
          </NavLink>
        </div>
      </nav>
    )
  }
}

interface WalletListItemProps {
  wallet: Wallet
  selectWallet: (wallet: Wallet) => any
  deleteWallet: (wallet: Wallet) => any
  isActive: boolean
}

const WalletListItem: React.SFC<WalletListItemProps> = ({
  wallet,
  selectWallet,
  deleteWallet,
  isActive,
}) => (
  <NavLink
    to={RootRoutes.dashboard}
    className={`panel-block`}
    activeClassName="is-active"
    onClick={() => selectWallet(wallet)}
    isActive={match => match && isActive}
  >
    <span className="panel-icon">
      <i className="fas fa-book" />
    </span>
    <span className="info" style={{ flexGrow: 2 }}>
      {wallet.accountName}
    </span>
    <button className="button is-small is-danger" onClick={() => deleteWallet(wallet)}>
      <span className="icon is-small">
        <i className="fas fa-trash-alt" />
      </span>
    </button>
  </NavLink>
)

export { WalletListItem, WalletList }
