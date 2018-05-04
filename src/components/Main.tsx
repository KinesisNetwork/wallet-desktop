import * as React from 'react'
import {
  AppSettings,
  CreateWallet,
  Dashboard,
  Sidebar,
} from '@components'
import {
  Connection,
  PasswordMap,
  Wallet,
  View,
  ViewParams,
} from '@types'
import { retrieveWallets } from '@services/wallets'
import { retrieveConnections, DEFAULT_CONNECTIONS } from '@services/connections'

export interface AppState {
  view: View
  walletList: Wallet[]
  connectionList: Connection[]
  passwordMap: PasswordMap
  viewParams: ViewParams
  connection: Connection
}

export class App extends React.Component<{}, AppState> {
  constructor (props) {
    super(props)
    this.state = {
      view: View.create,
      walletList: [],
      connection: DEFAULT_CONNECTIONS[0],
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
      <div className='columns is-marginless' style={{height: '100vh'}}>
        <div className='column is-one-quarter' style={{ backgroundColor: '#2b3e50', }} >
          <Sidebar />
        </div>
        <div className='column'>
          { this.viewMap(this.state.view) }
        </div>
      </div>
    )
  }
}
