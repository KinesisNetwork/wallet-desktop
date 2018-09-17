import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import { AccountPage } from '@components/AccountPage'
import { ConnectionSettings } from '@components/ConnectionSettings'
import { Payee } from '@components/Payee'
import { Sidebar } from '@components/Sidebar'
import { CreateWallet } from '@containers/CreateWallet'
import { RootRoutes } from '@types'

const MainPresentation: React.SFC = () => (
  <div className="columns is-marginless" style={{ height: '100vh' }}>
    <div className="column is-narrow is-paddingless"
      style={{
        marginTop: 12,
        backgroundColor: '#2B3E50' /* $grey-dark */,
      }}
    >
      <Sidebar />
    </div>
    <div className="column">
      <Switch>
        <Route path={RootRoutes.dashboard} component={AccountPage} />
        <Route path={RootRoutes.addressBook} component={Payee} />
        <Route path={RootRoutes.settings} component={ConnectionSettings} />
        <Route path={RootRoutes.create} component={CreateWallet} />
        <Redirect exact={true} path="/" to="/dashboard" />
      </Switch>
    </div>
  </div>
)

export { MainPresentation as Main }