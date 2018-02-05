import * as React from 'react'
import { AppState } from '../app'
import { getActiveWallet } from '../helpers/wallets';
const StellarSdk = require('stellar-sdk')

export class Balances extends React.Component<{appState: AppState}, {account: any, kinesisBalance: number, accountActivated: boolean}> {
  constructor (props) {
    super(props)
    this.state = { account: null, kinesisBalance: 0, accountActivated: true }
  }

  async componentDidMount() {
    StellarSdk.Network.use(new StellarSdk.Network('Test SDF Network ; September 2015'))

    try {
      const server = new StellarSdk.Server(this.props.appState.serverLocation, {allowHttp: true})
      const account = await server.loadAccount(getActiveWallet(this.props.appState).publicKey)
      const kinesisBalance = account.balances.filter(b => b.asset_type === 'native')[0].balance
      this.setState({account, kinesisBalance})
    } catch (e) {
      this.setState({accountActivated: false})
    }
  }

  render() {
    return (
      <div>
        <p>Public Key: {getActiveWallet(this.props.appState).publicKey}</p>
        <p>Reveal Private Key: </p>
        <p>Account activated: {JSON.stringify(this.state.accountActivated)}</p>
        <p>Kinesis Balance: {this.state.kinesisBalance}</p>
      </div>
    )
  }
}
