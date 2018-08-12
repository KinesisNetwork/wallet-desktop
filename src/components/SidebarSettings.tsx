import { WalletView } from '@types'
import * as React from 'react'

export interface Props {
  connectionName: string
  changeWalletView: (view: WalletView) => any
}

export const SidebarSettings: React.SFC<Props> = ({ connectionName, changeWalletView }) => (
  <div className='has-text-centered vertical-spaced' style={{ justifyContent: 'flex-end' }}>
    <div className='columns'>
      <label className='label is-small column'>Kinesis Wallet - alpha</label>
      <label className='label is-small column'>Connection: {connectionName}</label>
    </div>
    <button className='button is-outlined is-fullwidth' onClick={() => changeWalletView(WalletView.settings)}>
      Settings
    </button>
  </div>
)
