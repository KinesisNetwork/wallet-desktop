import * as React from 'react'

import { RootState } from '@store'
import { RootRoutes, WalletCreationRoutes } from '@types'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { Passphrase } from './Passphrase'

import * as logo from '@images/logo2.svg'
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
      <section className="section">
        <div className="container">
          <div className="level">
            <div className="level-item">
              <img src={logo} className="logo-sidebar" />
            </div>
          </div>
          <div className="columns is-centered">
            <div className="column is-half-fullhd is-two-thirds-tablet">
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
            </div>
          </div>
        </div>
      </section>
    )

export const WalletCreationScreens = withRouter(
  connect(mapStateToProps)(WalletCreationScreensPresentation),
)
