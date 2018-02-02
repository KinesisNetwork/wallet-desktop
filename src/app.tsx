import * as React from 'react'
import { CreateAccount, Dashboard } from './components'

export enum View {
  create,
  settings,
  dashboard
}

export interface AppState {
  publicKey: string
  privateKey: string
  view: View
  viewParams?: any
  serverLocation: string
}

export class App extends React.Component<undefined, AppState> {
  constructor (props) {
    super(props)
    this.state = {publicKey: '', privateKey: '', view: View.create, serverLocation: 'https://stellar-local.abx.com'}
  }

  public viewMap(view: View) {
    const ref = {
      [View.create]: <CreateAccount setAccountKeys={this.setAccountKeys.bind(this)} appState={this.state} changeView={this.changeView.bind(this)} />,
      [View.dashboard]: <Dashboard appState={this.state} changeView={this.changeView.bind(this)} />,
    }

    return ref[view]
  }

  public setAccountKeys (publicKey: string, privateKey: string): void {
    this.setState({publicKey, privateKey})
  }

  public changeView (view: View, viewParams?: any) {
    this.setState({view, viewParams})
  }

  render() {
    return (
      <div className='columns'>
        <div className='column is-one-quarter'>
          Menu
        </div>
        <div className='column'>
          { this.viewMap(this.state.view) }
        </div>
      </div>
    )
  }
}
