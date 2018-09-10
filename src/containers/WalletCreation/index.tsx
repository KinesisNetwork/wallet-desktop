import * as React from 'react'

import { RootState } from '@store'
import { RootRoutes, WalletCreationRoutes } from '@types'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { NamingWallet } from './NamingWallet'
import { Passphrase } from './Passphrase'

const mapStateToProps = (state: RootState) => ({
  hasStartedForms: !!state.wallet.create.passphrase,
})

type Props = RouteComponentProps<any> & ReturnType<typeof mapStateToProps>

const WalletCreationScreensPresentation: React.SFC<Props> = ({ match, hasStartedForms }) => (
  <section className="section">
    <Switch>
      <Route path={match.path + WalletCreationRoutes.first} component={NamingWallet} />
      <Route
        path={match.path + WalletCreationRoutes.second}
        render={props =>
          hasStartedForms ? (
            <Passphrase {...props} />
          ) : (
            <Redirect to={RootRoutes.create + WalletCreationRoutes.first} />
          )
        }
      />
      <Redirect to={match.path + WalletCreationRoutes.first} />
    </Switch>
  </section>
)

export const WalletCreationScreens = withRouter(
  connect(mapStateToProps)(WalletCreationScreensPresentation),
)
