import * as React from 'react'
import { Sidebar, Dashboard } from '@components'
import { CreateWallet } from '@containers'
import { PasswordMap, View } from '@types'

export interface AppState {
  passwordMap: PasswordMap
}

export interface Props {
  currentView: View
  loadWallets: () => any
  loadConnections: () => any
}

export class Main extends React.PureComponent<Props, AppState> {
  constructor (props) {
    super(props)
    this.state = {
      passwordMap: {},
    }
  }

  public componentDidMount() {
    this.props.loadConnections()
    this.props.loadWallets()
  }

  public viewMap(view: View) {
    switch (view) {
      case View.create: return <CreateWallet />
      case View.dashboard: return <Dashboard />
      default: return <div />
    }
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
          { this.viewMap(this.props.currentView) }
        </div>
      </div>
    )
  }
}
