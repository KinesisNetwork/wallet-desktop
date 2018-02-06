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
    this.state = { account: null, kinesisBalance: 0, accountActivated: true, password: '', name: '' }
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

  public setName(){
    this.props.setPassword(getActiveWallet(this.props.appState).publicKey, this.state.name))
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
        <div className='has-text-centered'>
          <h1 className='title-heading primary-font'>Wallet Dashboard</h1>
        </div>
        <div className='has-text-centered' style={{padding: '5px', marginTop: '10px'}}>
          <form onSubmit={(ev) => {ev.preventDefault(); this.setPassword()}}>
            <input className="input is-small" type="password" placeholder="Password" onChange={(e) => this.setState({password: e.target.value})} style={{display:'inline-block', maxWidth: '200px', padding: '17px 8px'}} />
            <button type='submit' className='button' style={{display:'inline-block'}}>
                <i className='fas fa-unlock-alt'></i> Unlock Wallet
            </button>
          </form>
        </div>
        <div className='columns' style={{marginTop: '20px'}}>
          <div className='column' style={{padding: '5px 60px 60px 70px', borderRight: '1px solid #2b3e50'}}>
            <Balances appState={this.props.appState}/>
          </div>
          <div className='column' style={{padding: '5px 60px 60px 70px'}}>
            <Transfer appState={this.props.appState} />
            <h1 className='sub-heading primary-font'>Settings</h1>
            <form onSubmit={(ev) => {ev.preventDefault(); this.setPassword()}}>
              <label className='label'>Give wallet a readable name.</label>
              <input className="input is-small" type="text" placeholder="Wallet Name" onChange={(e) => this.setState({name: e.target.value})} />
              <button type='submit' className='button'>
                  <i className='fa fa-arrow-circle-right fa-lg'></i> Wallet
              </button>
            </form>


            <input className='button is-danger' type='submit' value='Delete Wallet' onClick={() => this.deleteW(getActiveWallet(this.props.appState).publicKey)} />
          </div>
        </div>
        <Transactions appState={this.props.appState} />
      </div>
    )
  }
}
