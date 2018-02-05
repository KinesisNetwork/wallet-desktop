import * as React from 'react'
import { AppState, View } from '../app'
import { Balances } from './Balances'
import { Transfer } from './Transfer'
import { Transactions } from './Transactions'
import { deleteWallet } from '../services/wallet_persistance'
import { getActiveWallet } from '../helpers/wallets';
const StellarSdk = require('stellar-sdk')

// let rootAccount = 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H'
// let rootSecret = 'SDHOAMBNLGCE2MV5ZKIVZAQD3VCLGP53P3OBSBI6UN5L5XZI5TKHFQL4'
// GBFKKLA2BNMR2Q6MSQZWO5ZECDUL4TM3M6ZCWH2IVXTP2XSGY5IHVNPS, SCL2WJCPPNLSKCROIA3PV4W3N4NI5UIBO4Q35EUC7HH6WEJCEGZANE3M
// GAFRGE3S4Y5V32RCDTOHI5IOSXKBUZ6RKOVEXRLRPEQZ54FHHDHA4CH7, SBBFSKLTWIFPVQK6O4EC6A6AXJ4UM2IQCBZVOI2T2AOPWMIJ3G4GGZ65
export class Dashboard extends React.Component<{appState: AppState, setWalletList: Function, changeView: Function, setPassword: Function}, {account: any, kinesisBalance: number, accountActivated: boolean, targetAddress: string, transferAmount: number}> {
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
        <Balances appState={this.props.appState}/>
        <Transfer appState={this.props.appState} account={this.state.account}/>
        <Transactions appState={this.props.appState} />
        <button onClick={() => this.deleteW(getActiveWallet(this.props.appState).publicKey)}>Delete Wallet</button>
        <input className="input is-small" type="password" placeholder="Password" onChange={(e) => this.setState({password: e.target.value})} />
        <input className='button' type='submit' onClick={this.setPassword.bind(this)} />
      </div>
    )
  }
}
