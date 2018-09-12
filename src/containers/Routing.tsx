import { AccountPage } from '@components/AccountPage'
import { ConnectionSettings } from '@components/ConnectionSettings'
import { Payee } from '@components/Payee'
import { WalletCreationScreens } from '@containers/WalletCreation'
import { RootState } from '@store'
import { RootRoutes } from '@types'
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'

const mapStateToProps = (state: RootState) => ({
  isLoggedIn: !!state.wallet.passphrase,
})

type Props = RouteComponentProps<any> & ReturnType<typeof mapStateToProps>
const RoutingPresentation: React.SFC<Props> = props => (
  <Switch>
    <Route path={RootRoutes.dashboard} component={AccountPage} />
    <Route path={RootRoutes.addressBook} component={Payee} />
    <Route path={RootRoutes.settings} component={ConnectionSettings} />
    <Route path={RootRoutes.create} component={WalletCreationScreens} />
    <Redirect exact={true} path="/" to={RootRoutes.create} />
  </Switch>
)

const Routing = withRouter(connect(mapStateToProps)(RoutingPresentation))

export { Routing }
