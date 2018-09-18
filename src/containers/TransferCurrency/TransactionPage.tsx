import { goBack, push } from 'connected-react-router';
import * as React from 'react'
import { connect } from 'react-redux'

import * as kagLogo from '@icons/kag-icon.svg'
import * as kauLogo from '@icons/kau-icon.svg'

import { InputField } from '@components/InputField';
import { RootState } from '@store'
import { Currency, RootRoutes } from '@types'

const mapStateToProps = (state: RootState) => ({
  currency: state.connections.currentCurrency,
  balance: state.accounts.accountInfo.balance
})

const mapDispatchToProps = {
  goBackToDashboard: () => goBack(),
  goToConfirm: () => push(RootRoutes.dashboard + '/confirm')
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

export const TransactionPagePresentation: React.SFC<Props> = ({
  currency,
  balance,
  goBackToDashboard,
  goToConfirm
}) => (
    <React.Fragment>
      <div className="columns is-mobile is-centered">
        <div className="column is-one-third">
          <section className="section has-text-centered">
            <div className="level">
              <div className="level-item">
                <figure className="image is-128x128">
                  <img src={currency === Currency.KAU ? kauLogo : kagLogo} className="is-rounded" />
                </figure>
              </div>
            </div>
            <div className="level">
              <div className="level-item">
                <h1 className={`title has-text-weight-bold is-uppercase ${
                  currency === Currency.KAU ? 'has-text-primary' : 'has-text-grey-light'
                  }`}>
                  Send {currency}
                </h1>
              </div>
            </div>
            <div className="level">
              <div className="level-item has-text-grey-lighter">
                {balance} Available
            </div>
            </div>
          </section>
          <form className="field">
            <InputField
              id='transfer-to'
              value=''
              placeholder='Recipient Address'
              onChangeHandler={() => null}
              label='To'
              icon='fa-chevron-down'
            />
            <InputField
              id='transfer-amount'
              value=''
              placeholder={`0 ${currency}`}
              onChangeHandler={() => null}
              label='Amount'
            />
            <InputField
              id='transfer-description'
              value=''
              onChangeHandler={() => null}
              label='Description'
              placeholder='Optional'
              helpText='0 / 25'
            />
          </form>
          <section className="columns">
            <div className="column content has-text-grey-lighter">
              <p>Transaction fee</p>
              <p>Remaining balance</p>
            </div>
            <div className={`column has-text-right content ${
              currency === Currency.KAU ? 'has-text-primary' : 'has-text-grey-light'
              }`}>
              <p>0.00 {currency}</p>
              <p>41.1807 {currency}</p>
            </div>
          </section>
          <section className="field is-grouped is-grouped-right">
            <p className="control">
              <button className="button" onClick={goBackToDashboard}>Cancel</button>
            </p>
            <p className="control">
              <a className="button is-primary" onClick={goToConfirm}>
                <span className="icon"><i className="fal fa-arrow-up" /></span>
                <span>Send</span>
              </a>
            </p>
          </section>
        </div>
      </div>
    </React.Fragment>
  )

const ConnectedTransactionPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionPagePresentation)

export { ConnectedTransactionPage as TransactionPage }
