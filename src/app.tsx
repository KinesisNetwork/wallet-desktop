import * as React from 'react'
import { CreateAccount, Dashboard } from './components'
import { WalletList } from './components/WalletList';
import { retrieveWallets } from './services/wallet_persistance';

export enum View {
  create,
  settings,
  dashboard
}

export interface AppState {
  view: View,
  walletList: Wallet[],
  viewParams?: ViewParams,
  serverLocation: string
}

export interface ViewParams {
  walletIndex?: number
}

export interface Wallet {
  publicKey: string,
  encryptedPrivateKey: string,
  accountName?: string
}

export class App extends React.Component<undefined, AppState> {
  constructor (props) {
    super(props)
    this.state = {view: View.create, walletList: [], serverLocation: 'https://stellar-local.abx.com'}
  }

  public componentDidMount() {
    retrieveWallets()
      .then((walletList: Wallet[]) => {
        this.setWalletList(walletList || [])
      })
  }

  public viewMap(view: View) {
    const ref = {
      [View.create]: <CreateAccount setWalletList={this.setWalletList.bind(this)} appState={this.state} changeView={this.changeView.bind(this)} />,
      [View.dashboard]: <Dashboard appState={this.state} setWalletList={this.setWalletList.bind(this)} changeView={this.changeView.bind(this)} />,
    }

    return ref[view]
  }

  public setWalletList (walletList: Wallet[]): void {
    this.setState({walletList})
  }

  public changeView (view: View, viewParams?: ViewParams) {
    this.setState({view, viewParams})
  }

  render() {
    return (
      <div>
        <div className='columns'>
          <div className='column is-one-quarter'>
            <strong>Kinesis</strong>
            <WalletList appState={this.state} setWalletList={this.setWalletList.bind(this)} changeView={this.changeView.bind(this)} />
          </div>
          <div className='column'>
            { this.viewMap(this.state.view) }
          </div>
        </div>
        <div>
          Footer bar
        </div>
      </div>
    )
  }
}
