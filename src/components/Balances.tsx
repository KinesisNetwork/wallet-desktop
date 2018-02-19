import * as React from 'react'
import { AppState } from '../app'
import { getActiveWallet  } from '../helpers/wallets';
import { BalancesPresentation } from './BalancesPresentation';
const StellarSdk = require('stellar-sdk')

export class Balances extends React.Component<{appState: AppState}, {account: any, kinesisBalance: number, accountActivated: boolean}> {
  constructor (props) {
    super(props)
    this.state = { account: null, kinesisBalance: 0, accountActivated: false }
  }

  componentDidMount() {
    this.loadBalances(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.loadBalances(nextProps)
    }
  }

  // React antipattern (this is used via ref)
  public reloadBalances() {
    this.loadBalances(this.props)
  }

  public async loadBalances(props) {
    try {
      const server = new StellarSdk.Server(props.appState.connection.horizonServer, {allowHttp: true})
      const account = await server.loadAccount(getActiveWallet(props.appState).publicKey)
      const kinesisBalance = account.balances.filter(b => b.asset_type === 'native')[0].balance
      this.setState({account, kinesisBalance, accountActivated: true})
    } catch (e) {
      this.setState({accountActivated: false, kinesisBalance: 0})
    }
  }

  render() {
    return (
      <BalancesPresentation appState={this.props.appState} kinesisBalance={this.state.kinesisBalance} accountActivated={this.state.accountActivated} />
    )
  }
}
