import * as React from 'react'
import { CreateWallet, Dashboard } from './components'
import { WalletList } from './components/WalletList';
import { retrieveWallets } from './services/wallet_persistance';
import { AppSettings } from './components/AppSettings';
import { retrieveConnections, defaultConnections } from './services/connection_persistance';

export enum View {
  create,
  settings,
  dashboard,
}

export interface AppState {
  view: View,
  walletList: Wallet[],
  connectionList: Connection[],
  passwordMap: PasswordMap,
  viewParams: ViewParams,
  connection: Connection
}

export interface PasswordMap {
  [accountId: string]: {
    timestamp: number,
    password: string
  }
}

export interface ViewParams {
  walletIndex: number
}

export interface Wallet {
  publicKey: string,
  encryptedPrivateKey: string,
  accountName: string
}

export interface Connection {
  horizonServer: string,
  connectionName: string,
  networkPassphrase: string
}

export class App extends React.Component<undefined, AppState> {
  constructor (props) {
    super(props)
    this.state = {
      view: View.create,
      walletList: [],
      connection: defaultConnections[0],
      connectionList: [],
      passwordMap: {},
      viewParams: {
        walletIndex: 0,
      },
    }
  }

  public async componentDidMount() {
    const wallets = await retrieveWallets()
    this.setWalletList(wallets)
    const connections = await retrieveConnections()
    this.setConnectionList(connections)
    this.changeConnection(connections[0])
  }

  public viewMap(view: View) {
    const ref = {
      [View.create]: <CreateWallet setWalletList={this.setWalletList} appState={this.state} changeView={this.changeView} />,
      [View.dashboard]: <Dashboard appState={this.state} setWalletList={this.setWalletList} changeView={this.changeView} setPassword={this.setPassword} />,
      [View.settings]: <AppSettings setConnectionList={this.setConnectionList} appState={this.state} changeConnection={this.changeConnection} />,
    }

    return ref[view]
  }

  public setConnectionList = (connectionList: Connection[]): void => {
    this.setState({connectionList})
  }

  public setWalletList = (walletList: Wallet[]): void => {
    this.setState({walletList})
  }

  public changeConnection = (connection) => {
    this.setState({connection})
  }

  public changeView = (view: View, viewParams?: ViewParams) => {
    this.setState({
      view,
      viewParams: {
        ...this.state.viewParams,
        ...viewParams,
      }
    })
  }

  public setPassword = (accountId: string, password: string) => {
    this.setState({
      passwordMap: {
        ...this.state.passwordMap,
        [accountId]: {password: password, timestamp: Date.now()}
      }
    })
  }

  render() {
    return (
      <div className='columns' style={{height: '100%'}}>
        <div className='column is-one-quarter' style={{backgroundColor: '#2b3e50', padding: '0px', position: 'relative'}}>
          <img src='./logo.svg' className='logo-sidebar'/>
          <WalletList changeView={this.changeView} wallets={this.state.walletList} currentWallet={this.state.viewParams.walletIndex} />
          <div className='settings-btn'>
            <label className='label'> Connection: {this.state.connection.connectionName } </label>
            <button className='button is-outlined is-fullwidth' onClick={() => this.changeView(View.settings)}>
              Settings
            </button>
          </div>
        </div>
        <div className='column' style={{padding: '0px'}}>
          { this.viewMap(this.state.view) }
        </div>
      </div>
    )
  }
}
