import * as React from 'react'

import { AccountDashboard } from '@components/AccountDashboard'
import { AccountPanel } from '@containers/AccountPanel'
import { Onboarding } from '@containers/Onboarding'
import { RootState } from '@store'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'

const mapStateToProps = (state: RootState) => ({
  hasOnBoarded: state.settings.onBoarding,
})

type Props = RouteComponentProps<any> & ReturnType<typeof mapStateToProps>

const AccountPagePresentation: React.SFC<Props> = ({ match, hasOnBoarded }) => (
  <React.Fragment>
    {!hasOnBoarded && <Onboarding />}
    <AccountPanel />
    <Switch>
      <Route exact={true} path={`${match.path}`} component={AccountDashboard} />
    </Switch>
  </React.Fragment>
)

const AccountPage = withRouter(connect(mapStateToProps)(AccountPagePresentation))

export { AccountPage }
