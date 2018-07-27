import { ConnectionSettings, Payee, Sidebar } from '@components'
import { AccountPage, CreateWallet } from '@containers'
import { WalletView } from '@types'
import * as React from 'react'

export interface Props {
  activeView: WalletView
}

export class Main extends React.PureComponent<Props> {
  viewMap = (view: WalletView) => {
    switch (view) {
      case WalletView.create:
        return <CreateWallet />
      case WalletView.dashboard:
        return <AccountPage />
      case WalletView.settings:
        return <ConnectionSettings />
      case WalletView.payees:
        return <Payee />
      default:
        return <div />
    }
  }

  render() {
    return (
      <div className="columns is-marginless" style={{ height: '100vh' }}>
        <div className="column is-one-quarter" style={{ backgroundColor: '#2b3e50' }}>
          <Sidebar />
        </div>
        <div className="column">{this.viewMap(this.props.activeView)}</div>
      </div>
    )
  }
}
