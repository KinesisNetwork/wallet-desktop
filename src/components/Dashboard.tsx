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
      <div style={{display: 'table', width: '100%', height: '100%'}}>
        <div className='has-text-centered' style={{display: 'table-row'}}>
          <form className='title-heading' onSubmit={(ev) => {ev.preventDefault(); this.setPassword()}} style={{ paddingBottom: '28px', paddingTop: '24px'}}>
            <input className="input is-small" type="password" placeholder="Password" onChange={(e) => this.setState({password: e.target.value})} style={{display:'inline-block', maxWidth: '200px', padding: '17px 8px'}} />
            <button type='submit' className='button' style={{display:'inline-block'}}>
                <i className='fas fa-unlock-alt' style={{marginRight:'6px'}}></i> Unlock Wallet
            </button>
          </form>
        </div>
        <div style={{display: 'table-row'}}>
          <div className='columns' style={{marginTop: '20px'}}>
            <div className='column' style={{padding: '5px 60px 20px 70px', borderRight: '1px solid #2b3e50'}}>
              <Balances appState={this.props.appState}/>
            </div>
            <div className='column' style={{padding: '5px 70px 20px 60px'}}>
              <Transfer appState={this.props.appState} />
              <h1 className='sub-heading primary-font' style={{marginTop: '18px'}}>Settings</h1>
              <button type='submit' className='button is-danger' style={{width: '100%'}} onClick={() => this.deleteW(getActiveWallet(this.props.appState).publicKey)} >
                  <i className='fa fa-trash-alt fa-lg' style={{marginRight:'6px'}}></i> Delete Wallet
              </button>
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
    <div>
      <div>
      </div>
