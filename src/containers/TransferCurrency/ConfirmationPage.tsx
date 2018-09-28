import { RootState } from '@store'
import * as React from 'react'
import { connect } from 'react-redux'

import { showNotification, transferRequest } from '@actions'
import { CurrencyLogo } from '@containers/TransferCurrency/CurrencyLogo'
import { TransferSummary } from '@containers/TransferCurrency/TransferSummary'
import { addMetalColour } from '@helpers/walletUtils'
import { RootRoutes } from '@types'
import { goBack, replace } from 'connected-react-router'

import { Loader } from '@components/Loader'
import { TransactionAccounts } from '@containers/TransferCurrency/TransactionAccounts'

const mapStateToProps = (state: RootState) => {
  const {
    transfer: { formData },
  } = state
  return {
    currency: state.connections.currentCurrency,
    memo: formData.memo,
    fee: formData.fee,
    amount: formData.amount,
    formData,
    isTransferring: state.transfer.isTransferring,
  }
}

const mapDispatchToProps = {
  goBackToTransformPage: () => goBack(),
  transferRequest,
  goToDashboard: () => replace(RootRoutes.dashboard),
  showNotification,
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

export class ConfirmationPagePresentation extends React.Component<Props> {
  confirmAndGoToDashboard = () => {
    this.props.transferRequest(this.props.formData)
  }

  render() {
    return (
      <div style={{ position: 'relative' }}>
        {this.props.isTransferring && <Loader />}
        <div
          className="columns is-mobile is-centered"
          style={this.props.isTransferring ? { filter: 'blur(2px)' } : {}}
        >
          <div className="column is-three-fifths">
            <section className="section has-text-centered">
              <CurrencyLogo
                currency={this.props.currency}
                size="medium"
                title="Confirm transaction"
              />
            </section>
            <section className="columns is-vcentered">
              <TransactionAccounts />
            </section>
            <section className="section">
              <div className="columns is-centered">
                <div className="column is-two-thirds">
                  <div className="has-text-centered content">
                    <h1
                      className={`is-size-1 has-text-weight-bold ${addMetalColour(
                        this.props.currency,
                      )}`}
                    >
                      {Number(this.props.amount).toFixed(5)} {this.props.currency}
                    </h1>
                    <p className="has-text-grey-lighter">
                      {this.props.memo && <q>{this.props.memo}</q>}
                    </p>
                  </div>
                  <hr className="has-background-grey-lighter" />
                  <TransferSummary
                    currency={this.props.currency}
                    description="Transaction fee"
                    amount={Number(this.props.fee)}
                  />
                  <hr className="has-background-grey-lighter" />
                  <TransferSummary
                    currency={this.props.currency}
                    description="TOTAL"
                    amount={Number(this.props.amount) + Number(this.props.fee)}
                  />
                  <hr className="has-background-grey-lighter" />
                  <section className="field is-grouped is-grouped-right">
                    <p className="control">
                      <button className="button is-text" onClick={this.props.goBackToTransformPage}>
                        Back
                      </button>
                    </p>
                    <p className="control">
                      <button className="button is-primary" onClick={this.confirmAndGoToDashboard}>
                        <span className="icon">
                          <i className="fal fa-arrow-up" />
                        </span>
                        <span>Confirm</span>
                      </button>
                    </p>
                  </section>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

const ConnectedConfirmationPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmationPagePresentation)

export { ConnectedConfirmationPage as ConfirmationPage }
