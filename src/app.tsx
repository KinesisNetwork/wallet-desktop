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
  publicKey: string
  privateKey: string
  view: View,
  walletList: any[],
  viewParams?: any
  serverLocation: string
}

export class App extends React.Component<undefined, AppState> {
  constructor (props) {
    super(props)
    this.state = {publicKey: '', privateKey: '', view: View.create, walletList: [], serverLocation: 'https://stellar-local.abx.com'}
  }

  public componentDidMount() {
    retrieveWallets()
      .then((walletList = []) => {
        console.log(walletList)
        this.setWalletList(walletList)
      })
  }

  public viewMap(view: View) {
    const ref = {
      [View.create]: <CreateAccount setWalletList={this.setWalletList.bind(this)} setAccountKeys={this.setAccountKeys.bind(this)} appState={this.state} changeView={this.changeView.bind(this)} />,
      [View.dashboard]: <Dashboard appState={this.state} changeView={this.changeView.bind(this)} />,
    }

    return ref[view]
  }

  public setAccountKeys (publicKey: string, privateKey: string): void {
    this.setState({publicKey, privateKey})
  }

  public setWalletList (walletList: any[]): void {
    this.setState({walletList})
  }

  public changeView (view: View, viewParams?: any) {
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
