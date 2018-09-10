import * as React from 'react'

import { AccountPage } from '@components/AccountPage'
import { ConnectionSettings } from '@components/ConnectionSettings'
import { Payee } from '@components/Payee'
import { Sidebar } from '@components/Sidebar'
// import { CreateWallet } from '@containers/CreateWallet'
import { WalletCreationScreens } from '@containers/WalletCreation'
import { RootRoutes } from '@types'
import { Redirect, Route, Switch } from 'react-router'

const MainPresentation: React.SFC = () => (
  <div className="columns is-marginless" style={{ height: '100vh' }}>
    <div className="column is-one-quarter" style={{ backgroundColor: '#2b3e50' }}>
      <Sidebar />
    </div>
    <div className="column">
      <Switch>
        <Route path={RootRoutes.dashboard} component={AccountPage} />
        <Route path={RootRoutes.addressBook} component={Payee} />
        <Route path={RootRoutes.settings} component={ConnectionSettings} />
        {/* <Route path={RootRoutes.create} component={CreateWallet} /> */}
        <Route path={RootRoutes.create} component={WalletCreationScreens} />
        <Redirect exact={true} path="/" to="/dashboard" />
      </Switch>
    </div>
  </div>
)

export { MainPresentation as Main }
