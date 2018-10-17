import { RootState } from '@store'
import * as React from 'react'
import { connect } from 'react-redux'

import { showNotification, transferRequest } from '@actions'
import { CurrencyLogo } from '@containers/TransferCurrency/CurrencyLogo'
import { TransferSummary } from '@containers/TransferCurrency/TransferSummary'
import { goBack } from 'connected-react-router'

import { Loader } from '@components/Loader'
import { AccountsInTransfer } from '@containers/TransferCurrency/AccountsInTransfer'
import { TransferButtons } from '@containers/TransferCurrency/TransferButtons'
import { ImageSize } from '@types'

const mapStateToProps = ({
  transfer: { formData, isTransferring },
  connections: { currentCurrency },
}: RootState) => ({
  currency: currentCurrency,
  formData,
  isTransferring,
})

const mapDispatchToProps = {
  goBackToTransferPage: goBack,
  transferRequest,
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
                size={ImageSize.medium}
                title="Confirm transaction"
              />
            </section>
            <section className="columns is-vcentered">
              <AccountsInTransfer />
            </section>
            <section className="section">
              <div className="columns is-centered">
                <div className="column is-two-thirds">
                  <TransferSummary />
                  <TransferButtons
                    cancelButtonClick={this.props.goBackToTransferPage}
                    cancelText="Back"
                    isDisabled={this.props.isTransferring}
                    nextStepButtonClick={this.confirmAndGoToDashboard}
                    nextStepText="Confirm"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

const ConfirmationPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmationPagePresentation)

export { ConfirmationPage }
