import { Wallet } from '@types'
import * as React from 'react'

export interface Props {
  wallets: Wallet[]
  currentWallet: number
  selectWallet: (walletIndex: number) => any
  addWallet: () => any
}

export const WalletList: React.SFC<Props> = ({ wallets, addWallet, selectWallet }) => (
  <nav className='panel'>
    <p className='panel-heading wallet-heading'>
      Wallets
    </p>
    {wallets.map((wallet, walletIndex) => (
      <a key={walletIndex}
        className='panel-block'
        onClick={() => selectWallet(walletIndex)}>
        <span className='panel-icon'>
          <i className='fas fa-book' />
        </span>
        <span className='info'>{wallet.accountName}</span>
      </a>
    ))}
    <div className='panel-block'>
      <button className='button is-primary is-outlined is-fullwidth' onClick={() => addWallet()}>
        Add Wallet
      </button>
    </div>
  </nav>
)
