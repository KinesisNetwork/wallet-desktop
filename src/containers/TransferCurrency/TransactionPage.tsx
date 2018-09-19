import { goBack, push } from 'connected-react-router'
import * as React from 'react'
import { connect } from 'react-redux'

import { updateTransferForm } from '@actions'

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
    ...transfer.form,
    currency: state.connections.currentCurrency,
    balance: state.accounts.accountInfo.balance,
    connection: getCurrentConnection(connections).endpoint,
  }
}

const mapDispatchToProps = {
  goBackToDashboard: () => goBack(),
  goToConfirm: () => push(RootRoutes.dashboard + '/confirm'),
  updateTransferForm,
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

export class TransactionPagePresentation extends React.Component<Props> {
  checkValidAmount = async () => {

    // if (Number(fee) + Number(this.props.amount) > Number(this.props.balance)) {
    //   throw new InputError(
    //     `Transfer amount (including ${fee} fee) is higher than your account balance`,
    //     'transfer-amount',
    //   )
    // } else if (Number(this.props.amount) <= 0) {
    //   throw new InputError('Transfer amount must be greater than 0', 'transfer-amount')
    // } else if (!this.props.amount) {
    //   throw new InputError('Amount is required', 'transfer-amount')
    // }
  }

  render() {
    const { updateTransferForm: handleChange } = this.props
    return (
      <React.Fragment>
        <div className="columns is-mobile is-centered">
          <div className="column is-one-third">
            <section className="section has-text-centered">
              <div className="level">
                <div className="level-item">
                  <figure className="image is-128x128">
                    <img src={this.props.currency === Currency.KAU ? kauLogo : kagLogo} className="is-rounded" />
                  </figure>
                </div>
              </div>
              <div className="level">
                <div className="level-item">
                  <h1 className={`title has-text-weight-bold is-uppercase ${
                    addMetalColour(this.props.currency)
                    }`}>
                    Send {this.props.currency}
                  </h1>
                </div>
              </div>
              <div className="level">
                <div className="level-item has-text-grey-lighter">
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
              <div className={`column has-text-right content ${addMetalColour(this.props.currency)}`}>
                <p>0 {this.props.currency}</p>
                <p>41.1807 {this.props.currency}</p>
              </div>
            </section>
            <section className="field is-grouped is-grouped-right">
              <p className="control">
                <button className="button is-text" onClick={this.props.goBackToDashboard}>Cancel</button>
              </p>
              <p className="control">
                <a className="button is-primary" onClick={this.props.goToConfirm}>
                  <span className="icon"><i className="fal fa-arrow-up" /></span>
                  <span>Send</span>
                </a>
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
