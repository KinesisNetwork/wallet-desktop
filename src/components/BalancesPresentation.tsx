import * as React from 'react'
import { AppState } from '../app'
import { getActiveWallet } from '../helpers/wallets'

export interface Props {
  appState: AppState
  kinesisBalance: number
  accountActivated: boolean
}

export const BalancesPresentation: React.SFC<Props> = (props) => {
  const activeWallet = getActiveWallet(props.appState) || {}
  return (
    <div>
      <h1 className='sub-heading primary-font'>Account Information</h1>
      <label className='label'>Public Key: </label>
      <span className='info'>{activeWallet.publicKey}</span>
      <div style={{marginTop: '15px'}}>
        <label className='label' style={{display: 'inline'}}>Account activated: </label>
        <span className='info'>{props.accountActivated ? 'Yes' : 'No'}</span>
      </div>
      <div style={{marginTop: '15px'}}>
        <label className='label' style={{display: 'inline'}}>Kinesis Balance: </label>
        <span className='info'>{props.kinesisBalance}</span>
      </div>
    </div>
    )
}
