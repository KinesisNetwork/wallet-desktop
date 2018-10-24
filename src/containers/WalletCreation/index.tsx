import * as React from 'react'

import { RootState } from '@store'
import { RootRoutes, WalletCreationRoutes } from '@types'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { Passphrase } from './Passphrase'

import { getLoginState } from '@selectors'
import { NamingWallet } from './NamingWallet'
import { ValidatePassphrase } from './ValidatePassphrase'

const mapStateToProps = (state: RootState) => ({
  hasStartedForms: !!state.createWallet.passphrase,
  isLoggedIn: getLoginState(state.wallet),
})

type Props = RouteComponentProps<any> & ReturnType<typeof mapStateToProps>

const WalletCreationScreensPresentation: React.SFC<Props> = ({
  match,
  location: { pathname },
  hasStartedForms,
  isLoggedIn,
}) =>
  isLoggedIn ? (
    <Redirect to="/" />
  ) : (
    <React.Fragment>
      <div className="steps">
        <div className={`step-item is-success is-completed`}>
          <div className="step-marker">
            <span className="icon">
              <i className="fas fa-user" />
            </span>
          </div>
        </div>
        <div
          className={`step-item is-success ${!pathname.includes(WalletCreationRoutes.first) &&
            'is-completed'}`}
        >
          <div className="step-marker">
            <span className="icon">
              <i className="fas fa-key" />
            </span>
          </div>
        </div>
        <div
          className={`step-item is-success ${pathname.includes(WalletCreationRoutes.third) &&
            'is-completed'}`}
        >
          <div className="step-marker">
            <span className="icon">
              <i className="fas fa-check" />
            </span>
          </div>
        </div>
      </div>
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
        <Route
          path={match.path + WalletCreationRoutes.third}
          render={props =>
            hasStartedForms ? (
              <ValidatePassphrase {...props} />
            ) : (
              <Redirect to={RootRoutes.create + WalletCreationRoutes.first} />
            )
          }
        />
        <Redirect to={match.path + WalletCreationRoutes.first} />
      </Switch>
    </React.Fragment>
  )

export const WalletCreationScreens = withRouter(
  connect(mapStateToProps)(WalletCreationScreensPresentation),
)
