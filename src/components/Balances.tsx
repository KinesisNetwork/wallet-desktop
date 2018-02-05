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
        <p>Public Key: {activeWallet.publicKey}</p>
        <p>Reveal Private Key: {getPrivateKey(this.props.appState, activeWallet)}</p>
        <p>Account activated: {JSON.stringify(this.state.accountActivated)}</p>
        <p>Kinesis Balance: {this.state.kinesisBalance}</p>
      </div>
    )
  }
}
