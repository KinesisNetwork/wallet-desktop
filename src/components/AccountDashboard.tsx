import * as React from 'react'

import { CurrencySelector } from '@containers/CurrencySelector'

import * as kagLogo from '@icons/kag-icon.svg'
import * as kauLogo from '@icons/kau-icon.svg'
import { RootState } from '@store'
import { Currency, RootRoutes } from '@types'
import * as sleeping from 'images/wally-sleeping.svg'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

const mapStateToProps = (state: RootState) => ({
  currency: state.connections.currentCurrency,
  balance: state.accounts.accountInfo.balance,
})

type Props = ReturnType<typeof mapStateToProps>

const AccountDashboardPresentation: React.SFC<Props> = props => (
  <React.Fragment>
    <div className="container">
      <CurrencySelector />
      <section className="section has-text-centered">
        <div className="level">
          <div className="level-item">
            <figure className="image is-128x128">
              <img
                src={props.currency === Currency.KAU ? kauLogo : kagLogo}
                className="is-rounded"
              />
            </figure>
          </div>
        </div>
        <div className="level">
          <div className="level-item">
            <h1
              className={`title is-size-2 has-text-weight-bold ${
                props.currency === Currency.KAU ? 'has-text-primary' : 'has-text-grey-light'
              }`}
            >{`${props.balance} ${props.currency}`}</h1>
          </div>
        </div>
        <div className="level">
          <div className="level-item">
            <NavLink to={RootRoutes.dashboard + '/send'} className="button is-primary is-large">
              <span className="icon is-large">
                <i className="fal fa-arrow-up" />
              </span>
              <span>Send</span>
            </NavLink>
          </div>
        </div>
      </section>
      <section className="section">
        <h1 className="subtitle">Transactions</h1>
        <hr />
        <div className="level">
          <div className="level-item">
            <img src={sleeping} style={{ height: '200px' }} />
          </div>
          <div className="level-item">
            <div>
              <h2 className="subtitle">There's nothing here...</h2>
              <h2 className="subtitle">
                Once {props.currency} transactions have been made, we'll show the history here!
              </h2>
              <h2 className="subtitle">Need to buy Kinesis?</h2>
              <div>
                <a>Visit the exchange</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </React.Fragment>
)

const AccountDashboard = connect(mapStateToProps)(AccountDashboardPresentation)

export { AccountDashboard }
