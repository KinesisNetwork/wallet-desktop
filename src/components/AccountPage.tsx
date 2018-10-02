import * as React from 'react'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'

import { AccountDashboard } from '@components/AccountDashboard'
import { AccountPanel } from '@containers/AccountPanel'
import { Onboarding } from '@containers/Onboarding'
import { Sign } from '@containers/Sign'
import { ConfirmationPage, TransferPage } from '@containers/TransferCurrency'
import { RootState } from '@store'

const mapStateToProps = (state: RootState) => ({
  hasOnBoarded: state.settings.onBoarding,
})

type Props = RouteComponentProps<any> & ReturnType<typeof mapStateToProps>

const AccountPagePresentation: React.SFC<Props> = ({ match, hasOnBoarded }) => (
  <React.Fragment>
    {!hasOnBoarded && <Onboarding />}
    <AccountPanel />
    <Switch>
      <Route path={`${match.path}/sign`} component={Sign} />
      <Route path={`${match.path}/send`} component={TransferPage} />
      <Route exact={true} path={match.path} component={AccountDashboard} />
      <Route path={`${match.path}/confirm`} component={ConfirmationPage} />
    </Switch>
  </React.Fragment>
)

const AccountPage = withRouter(connect(mapStateToProps)(AccountPagePresentation))

export { AccountPage }
