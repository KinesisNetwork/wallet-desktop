import * as React from 'react'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'

import * as logo from '@images/logo2.svg'
import { WalletRecoverRoutes } from '@types'
import { ConfirmRecoverWallet } from './ConfirmRecoverWallet'
import { ImportPassphrase } from './ImportPassphrase'
import { NamingWallet } from './NamingWallet'
import { ValidateRestoration } from './ValidateRestoration'

type Props = RouteComponentProps<any>

const { first, second, third, fourth } = WalletRecoverRoutes

function areAnyInPath(path: string, ...endpoints: string[]) {
  return endpoints.some(ep => path.includes(ep))
}

const WalletRecoverPresentation: React.SFC<Props> = ({
  location: { pathname },
  match,
}) => ( 
  <section className="section">
    <div className="container is-fluid">
      <div className="level">
        <div className="level-item">
          <img src={logo} className="logo-sidebar" />
        </div>
      </div>
      <div className="columns is-centered">
        <div className="column is-half-fullhd is-two-thirds-tablet">
          <div className="steps">
            <div className={`step-item is-success ${areAnyInPath(pathname, second, third, fourth) && 'is-completed' }`}>
              <div className="step-marker">
                <span className="icon">
                  <i className="fas fa-key" />
                </span>
              </div>
            </div>
            <div className={`step-item is-success ${pathname.includes(fourth) && 'is-completed' }`}>
              <div className="step-marker">
                <span className="icon">
                  <i className="fas fa-check" />
                </span>
              </div>
            </div>
          </div>
          <Switch>
            <Route
              component={ConfirmRecoverWallet}
              path={match.path.concat(first)}
            />
            <Route
              component={ImportPassphrase}
              path={match.path.concat(second)}
            />
            <Route
              component={ValidateRestoration}
              path={match.path.concat(third)}
            />
            <Route
              component={NamingWallet}
              path={match.path.concat(fourth)}
            />
            <Redirect to={match.path.concat(first)} />
          </Switch>
        </div>
      </div>
    </div>
  </section>
)

export const WalletRecoverScreens = withRouter(WalletRecoverPresentation)
