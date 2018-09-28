import { RootState } from '@store'
import * as React from 'react'
import { connect } from 'react-redux'

import { showNotification, transferRequest } from '@actions'
import { CurrencyLogo } from '@containers/TransferCurrency/CurrencyLogo'
import { TransferSummary } from '@containers/TransferCurrency/TransferSummary'
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
                  <TransferSummary />
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
