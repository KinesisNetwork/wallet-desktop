import { CurrencySelector } from '@containers/CurrencySelector'
import { push } from 'connected-react-router'
import * as React from 'react'
import { connect } from 'react-redux'

import * as kagLogo from '@icons/kag-icon.svg'
import * as kauLogo from '@icons/kau-icon.svg'
import * as sleeping from 'images/wally-sleeping.svg'

import { RootState } from '@store'
import { Currency, RootRoutes } from '@types'

const mapStateToProps = (state: RootState) => ({
  currency: state.connections.currentCurrency,
  balance: state.accounts.accountInfo.balance,
})

const mapDispatchToProps = {
  goToSend: () => push(RootRoutes.dashboard + '/send'),
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const AccountDashboardPresentation: React.SFC<Props> = props => (
  <div className="container">
    <CurrencySelector />
    <section className="section has-text-centered">
      <div className="level">
        <div className="level-item">
          <figure className="image is-128x128">
            <img src={props.currency === Currency.KAU ? kauLogo : kagLogo} className="is-rounded" />
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
          <button
            className="button is-primary is-large"
            disabled={props.balance === 0}
            onClick={props.goToSend}
          >
            <span className="icon is-large">
              <i className="fal fa-arrow-up" />
            </span>
            <span>Send</span>
          </button>
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
)

const AccountDashboard = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountDashboardPresentation)

export { AccountDashboard }
