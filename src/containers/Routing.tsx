import { AccountPage } from '@components/AccountPage'
import { ConnectionSettings } from '@components/ConnectionSettings'
import { Payee } from '@components/Payee'
import { WelcomeScreen } from '@containers//WelcomeScreen'
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
const RoutingPresentation: React.SFC<Props> = props =>
  props.isLoggedIn ? (
    <Switch>
      <Route path={RootRoutes.dashboard} component={AccountPage} />
      <Route path={RootRoutes.addressBook} component={Payee} />
      <Route path={RootRoutes.settings} component={ConnectionSettings} />
      <Redirect to={RootRoutes.dashboard} />
    </Switch>
  ) : (
    <Switch>
      <Route exact={true} path="/" component={WelcomeScreen} />
      <Route path={RootRoutes.create} component={WalletCreationScreens} />
      <Redirect to="/" />
    </Switch>
  )

const Routing = withRouter(connect(mapStateToProps)(RoutingPresentation))

export { Routing }
