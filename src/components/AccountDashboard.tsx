import { push } from 'connected-react-router'
import * as React from 'react'
import { connect } from 'react-redux'

import { CurrencySelector } from '@containers/CurrencySelector'
import { Transactions } from '@containers/Transactions'

import { CurrencyLogo } from '@containers/TransferCurrency/CurrencyLogo'
import { addMetalColour } from '@helpers/walletUtils'
import { RootState } from '@store'
import { RootRoutes } from '@types'

const mapStateToProps = (state: RootState) => ({
  currency: state.connections.currentCurrency,
  balance: state.accounts.accountInfo.balance,
  amount: state.transfer.formData.amount,
})

const mapDispatchToProps = {
  goToSend: () => push(RootRoutes.dashboard + '/send'),
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const AccountDashboardPresentation: React.SFC<Props> = props => (
  <div>
    <CurrencySelector />
    <section className="section has-text-centered">
      <CurrencyLogo currency={props.currency} size="large" />
      <div className="level">
        <div className="level-item">
          <h1
            className={`title is-size-2 has-text-weight-bold ${addMetalColour(props.currency)}`}
          >{`${props.balance.toFixed(5)} ${props.currency}`}</h1>
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
    <section>
      <h1 className="subtitle">Transactions</h1>
      <hr />
      <Transactions />
    </section>
  </div>
)

const AccountDashboard = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountDashboardPresentation)

export { AccountDashboard }
