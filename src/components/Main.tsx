import { ConnectionSettings, Payee, Sidebar } from '@components'
import { AccountPage, CreateWallet } from '@containers'
import { View } from '@types'
import * as React from 'react'

export interface Props {
  currentView: View
}

export class Main extends React.PureComponent<Props> {
  constructor(props) {
    super(props)
  }

  viewMap = (view: View) => {
    switch (view) {
      case View.create: return <CreateWallet />
      case View.dashboard: return <AccountPage />
      case View.settings: return <ConnectionSettings />
      case View.payees: return <Payee />
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
