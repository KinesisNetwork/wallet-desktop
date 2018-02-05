import * as React from 'react'
import { AppState, View } from '../app'
import { Balances } from './Balances'
import { Transfer } from './Transfer'
import { Transactions } from './Transactions'
import { deleteWallet } from '../services/wallet_persistance'
import { getActiveWallet } from '../helpers/wallets';
const StellarSdk = require('stellar-sdk')

export class Dashboard extends React.Component<{appState: AppState, setWalletList: Function, changeView: Function, setPassword: Function}, {account: any}> {
  constructor (props) {
    super(props)
    this.state = { account: null, kinesisBalance: 0, accountActivated: true, password: '' }
  }

  public deleteW(accountId: string) {
    deleteWallet(accountId)
      .then((wallets) => {
        this.props.setWalletList(wallets)
        this.props.changeView(View.create, {})
      })
  }

  public setPassword(){
    this.props.setPassword(getActiveWallet(this.props.appState).publicKey, this.state.password))
  }

  async componentDidMount() {
    this.loadAccount(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.loadAccount(nextProps)
    }
  }

  public async loadAccount(props) {
    StellarSdk.Network.use(new StellarSdk.Network('Test SDF Network ; September 2015'))

    try {
      const server = new StellarSdk.Server(props.appState.serverLocation, {allowHttp: true})
      const account = await server.loadAccount(getActiveWallet(props.appState).publicKey)
      this.setState({account})
    } catch (e) {
      console.log('account not activated')
    }
  }

  render() {
    return (
      <div>
        <Balances appState={this.props.appState}/>
        <Transfer appState={this.props.appState} />
        <Transactions appState={this.props.appState} />
        <input className='button' type='submit' value='Delete Wallet' onClick={() => this.deleteW(getActiveWallet(this.props.appState).publicKey)} />
        <input className="input is-small" type="password" placeholder="Password" onChange={(e) => this.setState({password: e.target.value})} />
        <input className='button' type='submit' onClick={this.setPassword.bind(this)} />
      </div>
    )
  }
}
