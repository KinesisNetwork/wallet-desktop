import * as React from 'react'

import { AccountDashboard } from '@components/AccountDashboard'
import { Modal } from '@containers/Modal'
import { Sign } from '@containers/Sign'
import { getLoginState } from '@selectors'
import { RootState } from '@store'
import { connect } from 'react-redux'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'

const mapStateToProps = (state: RootState) => ({
  isLoggedIn: getLoginState(state.wallet),
  hasOnBoarded: state.modals.onBoarding
})

type Props = RouteComponentProps<any> & ReturnType<typeof mapStateToProps>

const AccountPagePresentation: React.SFC<Props> = ({ match, hasOnBoarded }) =>
  <React.Fragment>
    {!hasOnBoarded && <Modal />}
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
      </Switch>
    </div>
  </React.Fragment>

const AccountPage = withRouter(connect(mapStateToProps)(AccountPagePresentation))

export { AccountPage }
