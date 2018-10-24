import * as React from 'react'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'

import { WalletRecoverRoutes } from '@types'
import { ImportPassphrase } from './ImportPassphrase'
import { NamingWallet } from './NamingWallet'
import { ValidateRestoration } from './ValidateRestoration'

type Props = RouteComponentProps<any>

const { first, second, third } = WalletRecoverRoutes

const WalletRecoverPresentation: React.SFC<Props> = ({ location: { pathname }, match }) => (
  <React.Fragment>
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
  </React.Fragment>
)

export const WalletRecoverScreens = withRouter(WalletRecoverPresentation)
