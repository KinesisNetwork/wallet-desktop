import * as React from 'react'

import { AccountDashboard } from '@components/AccountDashboard'
import { Sign } from '@containers/Sign'
import { TransferCurrency } from '@containers/TransferCurrency'
import { getLoginState } from '@selectors'
import { RootState } from '@store'
import { connect } from 'react-redux'
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'

const mapStateToProps = (state: RootState) => ({
  isLoggedIn: getLoginState(state.wallet),
})

type Props = RouteComponentProps<any> & ReturnType<typeof mapStateToProps>

const AccountPagePresentation: React.SFC<Props> = ({ match, isLoggedIn }) =>
  !isLoggedIn ? (
    <Redirect to="/" />
  ) : (
      <div className="vertical-spaced">
        <div>
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <div className="buttons">
                  <NavLink
                    to={`${match.url}`}
                    exact={true}
                    className="button"
                    activeClassName="is-active"
                  >
                    <span className="icon">
                      <i className="fas fa-home" />
                    </span>
                  </NavLink>
                  <NavLink to={`${match.url}/sign`} className="button" activeClassName="is-active">
                    <span className="icon">
                      <i className="fas fa-pencil-alt" />
                    </span>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Switch>
          <Route exact={true} path={`${match.path}`} component={AccountDashboard} />
          <Route path={`${match.path}/sign`} component={Sign} />
          <Route path={`${match.path}/send`} component={TransferCurrency} />
        </Switch>
      </div>
    )

const AccountPage = withRouter(connect(mapStateToProps)(AccountPagePresentation))

export { AccountPage }
