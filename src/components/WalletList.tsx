import * as React from 'react'
import { View, Wallet, ViewParams } from '../app'

export interface IProps {
  wallets: Wallet[]
  currentWallet: number
  changeView: (view: View, options?: ViewParams) => void
}

export const WalletList: React.SFC<IProps> = ({ wallets, currentWallet, changeView }) => (
  <nav className='panel'>
    <p className='panel-heading wallet-heading'>
      Wallets
        </p>
    {wallets.map((wallet, walletIndex) => (
      <a key={walletIndex}
        className='panel-block'
        onClick={() => changeView(View.dashboard, { walletIndex })}>
        <span className='panel-icon'>
          <i className='fas fa-book' />
        </span>
        <span className='info'>{wallet.accountName}</span>
      </a>
    ))}
    <div className='panel-block'>
      <button className='button is-primary is-outlined is-fullwidth' onClick={() => changeView(View.create)}>
        Add Wallet
      </button>
    </div>
  </nav>
)
