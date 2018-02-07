import * as React from 'react'
import { AppState } from '../app'
import { Balances } from './Balances'
import { Transfer } from './Transfer'
import { Transactions } from './Transactions'
import { getActiveWallet } from '../helpers/wallets';
import { Password } from './Password';
import { Delete } from './Delete';
const StellarSdk = require('stellar-sdk')

export class Dashboard extends React.Component<{appState: AppState, setWalletList: Function, changeView: Function, setPassword: Function}, {account: any, kinesisBalance: number, accountActivated: boolean}> {
  constructor (props) {
    super(props)
    this.state = { account: null, kinesisBalance: 0, accountActivated: true }
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
    StellarSdk.Network.use(new StellarSdk.Network(props.appState.connection.networkPassphrase))

    try {
      const server = new StellarSdk.Server(props.appState.connection.horizonServer, {allowHttp: true})
      const account = await server.loadAccount(getActiveWallet(props.appState).publicKey)
      this.setState({account})
    } catch (e) {
      console.log('account not activated')
    }
  }

  render() {
    return (
      <div style={{display: 'table', width: '100%', height: '100%'}}>
        <div className='has-text-centered' style={{display: 'table-row'}}>
          <Password appState={this.props.appState} setPassword={this.props.setPassword} />
        </div>
        <div style={{display: 'table-row'}}>
          <div className='columns' style={{marginTop: '20px'}}>
            <div className='column' style={{padding: '5px 60px 20px 70px', borderRight: '1px solid #2b3e50'}}>
              <Balances appState={this.props.appState}/>
            </div>
            <div className='column' style={{padding: '5px 70px 20px 60px'}}>
              <Transfer appState={this.props.appState} />
              <Delete appState={this.props.appState} setWalletList={this.props.setWalletList} changeView={this.props.changeView} />
            </div>
          </div>
        </div>
        <div style={{paddingLeft: '60px', marginBottom: '15px'}}>
          <h1 className='sub-heading primary-font'>Transactions</h1>
        </div>
        <Transactions appState={this.props.appState} />
      </div>
    )
  }
}
