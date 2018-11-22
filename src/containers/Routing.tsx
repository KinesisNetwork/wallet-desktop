import * as React from 'react'
import SVG from 'react-inlinesvg'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'

import { AccountPage } from '@components/AccountPage'
import { ConnectionSettings } from '@components/ConnectionSettings'
import { ExchangePage } from '@components/ExchangePage'
import { Contacts } from '@containers/Contacts'
import { ImportAccount } from '@containers/ImportAccount'
import { Sidebar } from '@containers/Sidebar'
import { WalletCreationScreens } from '@containers/WalletCreation'
import { WalletRecoverScreens } from '@containers/WalletRecovery'
import { WelcomeScreen } from '@containers/WelcomeScreen'
import { RootState } from '@store'
import { RootRoutes } from '@types'
import * as logo from 'images/KinesisWallet.svg'
import TestnetBanner from './TestnetBanner'

const mapStateToProps = (state: RootState) => ({
  isLoggedIn: !!state.wallet.passphrase,
})

type Props = RouteComponentProps<any> & ReturnType<typeof mapStateToProps>
const RoutingPresentation: React.SFC<Props> = props =>
  props.isLoggedIn ? (
    <div className="columns is-marginless is-centered is-marginless">
      <div className="sidebar-wrapper column is-narrow is-paddingless">
        <Sidebar />
      </div>
      <div className="column is-paddingless">
        <TestnetBanner />
        <div className="columns is-centered is-marginless">
          <div className="column is-paddingless is-8-fullhd is-9-widescreen is-10-desktop container is-fullhd">
            <div className="section">
              <Switch>
                <Route path={RootRoutes.dashboard} component={AccountPage} />
                <Route path={RootRoutes.contacts} component={Contacts} />
                <Route path={RootRoutes.settings} component={ConnectionSettings} />
                <Route path={RootRoutes.importAccount} component={ImportAccount} />
                <Route path={RootRoutes.recover} component={WalletRecoverScreens} />
                <Route path={RootRoutes.exchange} component={ExchangePage} />
                <Redirect to={RootRoutes.dashboard} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <section className="section">
      <div className="container">
        <div className="columns is-mobile is-centered">
          <div className="column is-half-fullhd is-two-thirds-tablet">
            <div className="level">
              <SVG src={logo} wrapper={React.createFactory('div')} className="level-item">
                <img src={logo} alt="Kinesis Wallet Logo" />
              </SVG>
            </div>
            <Switch>
              <Route exact={true} path="/" component={WelcomeScreen} />
              <Route path={RootRoutes.create} component={WalletCreationScreens} />
              <Route path={RootRoutes.recover} component={WalletRecoverScreens} />
              <Redirect to="/" />
            </Switch>
          </div>
        </div>
      </div>
    </section>
  )

const Routing = withRouter(connect(mapStateToProps)(RoutingPresentation))

export { Routing }
