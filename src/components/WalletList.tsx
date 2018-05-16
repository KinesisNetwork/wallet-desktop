import { Wallet } from '@types'
import * as React from 'react'

export interface Props {
  wallets: Wallet[]
  currentWallet: number
  selectWallet: (walletIndex: number) => any
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
          name={wallet.accountName}
          isActive={this.props.currentWallet === index}
          selectWallet={this.props.selectWallet}
          index={index}
        />
      )
    })
  }

  render() {
    const { addWallet } = this.props
    return (
      <nav className='panel'>
        <p className='panel-heading wallet-heading'> Wallets </p>
        {this.renderWallets()}
        <div className='panel-block'>
          <button
            className='button is-primary is-outlined is-fullwidth'
            onClick={() => addWallet()}
          >
            Add Wallet
          </button>
        </div>
      </nav>
    )
  }
}

interface WalletListItemProps {
  name: string
  index: number
  selectWallet: (walletIndex: number) => any
  isActive: boolean
}

const WalletListItem: React.SFC<WalletListItemProps> = ({name, index, selectWallet, isActive}) => (
  <a className={`panel-block ${isActive ? 'is-active' : ''}`} onClick={() => selectWallet(index)}>
    <span className='panel-icon'>
      <i className='fas fa-book' />
    </span>
    <span className='info'>{name}</span>
  </a>
)
