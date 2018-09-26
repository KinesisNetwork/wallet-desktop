import * as React from 'react'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'

import * as logo from '@images/logo2.svg'
import { WalletRecoverRoutes } from '@types'
import { ImportPassphrase } from './ImportPassphrase'
import { NamingWallet } from './NamingWallet'
import { ValidateRestoration } from './ValidateRestoration'

type Props = RouteComponentProps<any>

const { first, second, third } = WalletRecoverRoutes

const WalletRecoverPresentation: React.SFC<Props> = ({ location: { pathname }, match }) => (
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
            <div className="step-item is-success is-completed">
              <div className="step-marker">
                <span className="icon">
                  <i className="fas fa-key" />
                </span>
              </div>
            </div>
            <div className={`step-item is-success ${pathname.includes(third) && 'is-completed'}`}>
              <div className="step-marker">
                <span className="icon">
                  <i className="fas fa-check" />
                </span>
              </div>
            </div>
          </div>
          <Switch>
            <Route component={ImportPassphrase} path={match.path.concat(first)} />
            <Route component={ValidateRestoration} path={match.path.concat(second)} />
            <Route component={NamingWallet} path={match.path.concat(third)} />
            <Redirect to={match.path.concat(first)} />
          </Switch>
        </div>
      </div>
    </div>
  </section>
)

export const WalletRecoverScreens = withRouter(WalletRecoverPresentation)
