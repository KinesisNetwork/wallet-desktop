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
import { getActiveAccount, getCurrentConnection } from '@selectors'
import { generateTransferTransaction } from '@services/transfer'
import { ImageSize } from '@types'
import * as copy from 'copy-to-clipboard'

const mapStateToProps = ({
  transfer: { formData, isTransferring },
  connections,
  wallet,
}: RootState) => ({
  connections,
  formData,
  isTransferring,
  wallet,
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

  copyRawTx = async () => {
    const rawTx = await generateTransferTransaction(
      getActiveAccount(this.props.wallet).keypair.publicKey(),
      getCurrentConnection(this.props.connections),
      this.props.formData,
    )

    copy(
      rawTx
    )
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
                currency={this.props.connections.currentCurrency}
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
                    copyText="Copy"
                    copyButtonClick={this.copyRawTx}
                    cancelButtonClick={this.props.goBackToTransferPage}
                    cancelText="Edit"
                    isDisabled={this.props.isTransferring}
                    nextStepButtonClick={this.confirmAndGoToDashboard}
                    nextStepText="Send"
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
