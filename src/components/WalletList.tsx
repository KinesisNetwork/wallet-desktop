import { Wallet } from '@types'
import * as React from 'react'

export interface Props {
  wallets: Wallet[]
  activeWallet: Wallet | null
  selectWallet: (wallet: Wallet) => any
  deleteWallet: (wallet: Wallet) => any
  addWallet: () => any
}

export class WalletList extends React.Component<Props> {
  constructor(props) {
    super(props)
  }

  renderWallets = () => {
    return this.props.wallets.map((wallet) => {
      return (
        <WalletListItem
          key={wallet.publicKey}
          wallet={wallet}
          isActive={!!this.props.activeWallet && this.props.activeWallet.publicKey === wallet.publicKey}
          selectWallet={this.props.selectWallet}
          deleteWallet={this.props.deleteWallet}
        />
      )
    })
  }

  render() {
    const { addWallet } = this.props
    return (
      <nav className='panel'>
        <p className='panel-heading wallet-heading'>Accounts</p>
        {this.renderWallets()}
        <div className='panel-block'>
          <button
            className='button is-primary is-outlined is-fullwidth'
            onClick={() => addWallet()}
          >
            Add Account
          </button>
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

const WalletListItem: React.SFC<WalletListItemProps> = ({ wallet, selectWallet, isActive, deleteWallet }) => (
  <a className={`panel-block ${isActive ? 'is-active' : ''}`} onClick={() => selectWallet(wallet)}>
    <span className='panel-icon'>
      <i className='fas fa-book' />
    </span>
    <span className='info' style={{ flexGrow: 2 }}>{wallet.accountName}</span>
    <button className='button is-small is-danger' onClick={() => deleteWallet(wallet)}>
      <span className='icon is-small'><i className='fas fa-trash-alt' /></span>
    </button>
  </a>
)
