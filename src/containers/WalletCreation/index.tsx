import * as React from 'react'

import { RootState } from '@store'
import { RootRoutes, WalletCreationRoutes } from '@types'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { NamingWallet } from './NamingWallet'
import { Passphrase } from './Passphrase'

import { ValidatePassphrase } from '@containers/WalletCreation/ValidatePassphrase'
import * as logo from 'Kinesis_Alpha.svg'

const mapStateToProps = (state: RootState) => ({
  hasStartedForms: !!state.wallet.create.passphrase,
})

type Props = RouteComponentProps<any> & ReturnType<typeof mapStateToProps>

const WalletCreationScreensPresentation: React.SFC<Props> = ({
  match,
  location: { pathname },
  hasStartedForms,
}) => (
  <section className="section">
    <div className="level">
      <div className="level-item">
        <img src={logo} className="logo-sidebar" />
      </div>
    </div>
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
  </section>
)

export const WalletCreationScreens = withRouter(
  connect(mapStateToProps)(WalletCreationScreensPresentation),
)
