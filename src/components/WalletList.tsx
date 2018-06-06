import { Wallet } from '@types'
import * as React from 'react'

export interface Props {
  wallets: Wallet[]
  currentWallet: number
  selectWallet: (walletIndex: number) => any
  deleteWallet: (wallet: Wallet) => any
  addWallet: () => any
}

export class WalletList extends React.Component<Props> {
  constructor(props) {
    super(props)
  }

  renderWallets = () => {
    return this.props.wallets.map((wallet, index) => {
      return (
        <WalletListItem
          key={index}
          wallet={wallet}
          isActive={this.props.currentWallet === index}
          selectWallet={this.props.selectWallet}
          index={index}
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
  index: number
  selectWallet: (walletIndex: number) => any
  deleteWallet: (wallet: Wallet) => any
  isActive: boolean
}

const WalletListItem: React.SFC<WalletListItemProps> = ({ wallet, index, selectWallet, isActive, deleteWallet }) => (
  <a className={`panel-block ${isActive ? 'is-active' : ''}`} onClick={() => selectWallet(index)}>
    <span className='panel-icon'>
      <i className='fas fa-book' />
    </span>
    <span className='info' style={{ flexGrow: 2 }}>{wallet.accountName}</span>
    <button className='button is-small is-danger' onClick={() => deleteWallet(wallet)}>
      <span className='icon is-small'><i className='fas fa-trash-alt' /></span>
    </button>
  </a>
)
