import { WalletView } from '@types'
import * as React from 'react'

export interface Props {
  changeWalletView: (view: WalletView) => any
}

export const SidebarPayee: React.SFC<Props> = ({ changeWalletView }) => (
  <div className='has-text-centered'>
    <button className='button is-outlined is-fullwidth' onClick={() => changeWalletView(WalletView.payees)}>
      Manage Payees
    </button>
  </div>
)

SidebarPayee.displayName = 'SidebarPayee'
