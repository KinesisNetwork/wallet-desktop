import * as React from 'react'
import { AppState } from '../app'
import { getActiveWallet, getPrivateKey } from '../helpers/wallets';
const StellarSdk = require('stellar-sdk')

export class Balances extends React.Component<{appState: AppState}, {account: any, kinesisBalance: number, accountActivated: boolean}> {
  constructor (props) {
    super(props)
    this.state = { account: null, kinesisBalance: 0, accountActivated: true }
  }

  componentDidMount() {
    this.loadBalances(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.loadBalances(nextProps)
    }
  }

  public async loadBalances(props) {
    try {
      const server = new StellarSdk.Server(props.appState.serverLocation, {allowHttp: true})
      const account = await server.loadAccount(getActiveWallet(props.appState).publicKey)
      const kinesisBalance = account.balances.filter(b => b.asset_type === 'native')[0].balance
      this.setState({account, kinesisBalance, accountActivated: true})
    } catch (e) {
      this.setState({accountActivated: false, kinesisBalance: 0})
    }
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
          <span className='info'>{this.state.accountActivated ? 'Yes' : 'No'}</span>
        </div>
        <div style={{marginTop: '15px'}}>
          <label className='label' style={{display: 'inline'}}>Kinesis Balance: </label>
          <span className='info'>{this.state.kinesisBalance}</span>
        </div>
      </div>
    )
  }
}
