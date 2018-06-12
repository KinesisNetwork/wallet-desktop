import { ConnectionSettings, Dashboard, Payee, Sidebar } from '@components'
import { CreateWallet } from '@containers'
import { WalletView } from '@types'
import * as React from 'react'

export interface Props {
  currentView: WalletView
}

export class Main extends React.PureComponent<Props> {
  constructor(props) {
    super(props)
  }

  viewMap = (view: WalletView) => {
    switch (view) {
      case WalletView.create: return <CreateWallet />
      case WalletView.dashboard: return <Dashboard />
      case WalletView.settings: return <ConnectionSettings />
      case WalletView.payees: return <Payee />
      default: return <div />
    }
  }

  render() {
    return (
      <div className='columns is-marginless' style={{ height: '100vh' }}>
        <div className='column is-one-quarter' style={{ backgroundColor: '#2b3e50' }} >
          <Sidebar />
        </div>
        <div className='column'>
          {this.viewMap(this.props.currentView)}
        </div>
      </div>
    )
  }
}
