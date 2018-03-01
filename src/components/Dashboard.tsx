import * as React from 'react'
import { AppState } from '../app'
import { getActiveWallet } from '../helpers/wallets';
import { DashboardPresentation } from './DashboardPresentation';
import * as StellarSdk from 'stellar-sdk'

export class Dashboard extends React.Component<
  {appState: AppState, setWalletList: Function, changeView: Function, setPassword: Function},
  {account: StellarSdk.AccountResponse | null, transfering: boolean, transferViewState: 'multi' | 'payment'}> {
  public tx
  public balances

  constructor (props) {
    super(props)
    this.state = { account: null, transfering: false, transferViewState: 'payment'}
  }

  async componentDidMount() {
    this.loadAccount(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.loadAccount(nextProps)
      this.setState({transferViewState: 'payment'})
    }
  }

  // A bit of a React antipattern. I should have lifted the state up instead.
  // But eh.
  public transferComplete() {
    this.tx.reloadTrasactions()
    this.balances.reloadBalances()
    this.setState({transfering: false})
  }

  public transferInitialised() {
    this.setState({transfering: true})
  }

  public async loadAccount(props) {
    StellarSdk.Network.use(new StellarSdk.Network(props.appState.connection.networkPassphrase))

    try {
      const server = new StellarSdk.Server(props.appState.connection.horizonServer, {allowHttp: true})
      const account = await server.loadAccount(getActiveWallet(props.appState).publicKey)
      this.setState({account})
    } catch (e) {
      console.log('account not activated')
    }
  }

  public updateTransferView = (view: 'multi' | 'payment') => {
    this.setState({transferViewState: view})
  }


  render() {
    return (
      <DashboardPresentation
        appState={this.props.appState}
        setWalletList={this.props.setWalletList}
        changeView={this.props.changeView}
        setPassword={this.props.setPassword}
        transferComplete={this.transferComplete.bind(this)}
        transferInitialised={this.transferInitialised.bind(this)}
        transfering={this.state.transfering}
        tx={(tx) => {this.tx = tx}}
        balances={(balances) => {this.balances = balances}}
        transferView={this.state.transferViewState}
        updateTransferView={this.updateTransferView}
      />
    )
  }
}
