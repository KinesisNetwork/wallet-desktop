import { goBack, push } from 'connected-react-router'
import * as React from 'react'
import { connect } from 'react-redux'

import {
  insufficientFunds,
  updateRemainingBalance,
  updateTransferForm
} from '@actions'

import * as kagLogo from '@icons/kag-icon.svg'
import * as kauLogo from '@icons/kau-icon.svg'

import { InputField } from '@components/InputField'
import { addMetalColour } from '@helpers/walletUtils'
import { getCurrentConnection } from '@selectors'
import { RootState } from '@store'
import { Currency, RootRoutes } from '@types'

const mapStateToProps = (state: RootState) => {
  const { connections, transfer } = state

  return {
    ...transfer.formData,
    ...transfer.formMeta,
    currency: state.connections.currentCurrency,
    balance: state.accounts.accountInfo.balance,
    connection: getCurrentConnection(connections).endpoint,
  }
}

const mapDispatchToProps = {
  goBackToDashboard: () => goBack(),
  goToConfirm: () => push(RootRoutes.dashboard + '/confirm'),
  updateTransferForm,
  insufficientFunds,
  updateRemainingBalance,
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

export class TransactionPagePresentation extends React.Component<Props> {
  hasFieldErrors() {
    const { amount: amountError, memo: memoError } = this.props.errors
    return this.props.amount === '' || !!amountError || !!memoError
  }

  componentDidMount() {
    this.props.updateRemainingBalance(this.props.balance)
    this.props.insufficientFunds(false)
  }

  render() {
    const { updateTransferForm: handleChange } = this.props
    return (
      <React.Fragment>
        <div className="columns is-mobile is-centered">
          <div className="column is-one-third">
            <section className="section has-text-centered" style={{ letterSpacing: '3px' }}>
              <div className="level">
                <div className="level-item">
                  <figure className="image is-128x128">
                    <img src={this.props.currency === Currency.KAU ? kauLogo : kagLogo} className="is-rounded" />
                  </figure>
                </div>
              </div>
              <div className="level">
                <div className="level-item">
                  <h1 className={`title is-size-4 has-text-grey-lighter has-text-weight-bold is-uppercase`}>
                    Send {this.props.currency}
                  </h1>
                </div>
              </div>
              <div className="level">
                <div className={`level-item title is-size-3 has-text-weight-semibold ${
                  addMetalColour(this.props.currency)
                  }`}>
                  {this.props.balance} Available
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
              />
              <InputField
                id='transfer-amount'
                value={this.props.amount}
                placeholder={`0 ${this.props.currency}`}
                onChangeHandler={newValue => handleChange({ field: 'amount', newValue })}
                label='Amount'
                errorText={this.props.errors.amount}
              />
              <InputField
                id='transfer-description'
                value={this.props.memo}
                onChangeHandler={newValue => handleChange({ field: 'memo', newValue })}
                label='Description'
                placeholder='Optional'
                helpText={`${this.props.memo.length || 0} / 25`}
                errorText={this.props.errors.memo}
              />
            </form>
            <section className="columns">
              <div className="column content has-text-grey-lighter">
                <p>Transaction fee</p>
                <p>Remaining balance</p>
              </div>
              <div className={`column has-text-right content ${addMetalColour(this.props.currency)}`}>
                <p>{Number(this.props.fee).toFixed(5) || 0} {this.props.currency}</p>
                <p>{this.props.remainingBalance.toFixed(5)} {this.props.currency}</p>
              </div>
            </section>
            <section className="field is-grouped is-grouped-right">
              <p className="control">
                <button className="button is-text" onClick={this.props.goBackToDashboard}>Cancel</button>
              </p>
              <p className="control">
                <button
                  className="button is-primary"
                  disabled={this.hasFieldErrors()}
                >
                  <span className="icon"><i className="fal fa-arrow-up" /></span>
                  <span>Send</span>
                </button>
              </p>
            </section>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const ConnectedTransactionPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionPagePresentation)

export { ConnectedTransactionPage as TransactionPage }
