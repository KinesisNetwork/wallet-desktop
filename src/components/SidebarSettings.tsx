import { WalletView } from '@types'
import * as React from 'react'

export interface Props {
  connectionName: string
  changeWalletView: (view: WalletView) => any
}

export const SidebarSettings: React.SFC<Props> = ({ connectionName, changeWalletView }) => (
  <div className='has-text-centered vertical-spaced' style={{ justifyContent: 'flex-end' }}>
    <label className='label is-small'>Connection: {connectionName}</label>
    <button className='button is-outlined is-fullwidth' onClick={() => changeWalletView(WalletView.settings)}>
      Settings
    </button>
  </div>
)
