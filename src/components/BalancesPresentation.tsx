import * as React from 'react'
import { AppState } from '../app'
import { getActiveWallet, getPrivateKey } from '../helpers/wallets';
const StellarSdk = require('stellar-sdk')

export class BalancesPresentation extends React.Component<{
  appState: AppState,
  kinesisBalance: number,
  accountActivated: boolean
}, {}> {
  constructor (props) {
    super(props)
  }

  render() {
    let activeWallet = getActiveWallet(this.props.appState) || {}
    return (
      <div>
        <h1 className='sub-heading primary-font'>Account Information</h1>
        <label className='label'>Public Key: </label>
        <span className='info'>{activeWallet.publicKey}</span>
        <label className='label'>Reveal Private Key: </label>
        <span className='info'>{getPrivateKey(this.props.appState, activeWallet) || 'Please enter your wallet password'}</span>
        <div style={{marginTop: '15px'}}>
          <label className='label' style={{display: 'inline'}}>Account activated: </label>
          <span className='info'>{this.props.accountActivated ? 'Yes' : 'No'}</span>
        </div>
        <div style={{marginTop: '15px'}}>
          <label className='label' style={{display: 'inline'}}>Kinesis Balance: </label>
          <span className='info'>{this.props.kinesisBalance}</span>
        </div>
      </div>
    )
  }
}
