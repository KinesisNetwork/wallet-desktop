import { RootState } from '@store'
import * as React from 'react'
import { connect } from 'react-redux'

import * as kagLogo from '@icons/kag-icon.svg'
import * as kauLogo from '@icons/kau-icon.svg'

import { showNotification, transferRequest } from '@actions'
import { AccountCard } from '@containers/TransferCurrency/AccountCard'
import { TransferSummary } from '@containers/TransferCurrency/TransferSummary'
import { addMetalColour } from '@helpers/walletUtils'
import { AddressDisplay, Currency, RootRoutes } from '@types'
import { goBack, replace } from 'connected-react-router'

import { Loader } from '@components/Loader'
import { getActiveAccount } from '@selectors'

const mapStateToProps = (state: RootState) => {
  const {
    transfer: { formData },
    wallet,
  } = state
  return {
    currency: state.connections.currentCurrency,
    walletName: state.wallet.persisted.walletName,
    memo: formData.memo,
    fee: formData.fee,
    amount: formData.amount,
    formData,
    activeAccount: getActiveAccount(wallet),
    isTransferring: state.transfer.isTransferring,
    contactList: state.contacts.contactList,
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

  getPayeeNameForAvatar = () => {
    const payeeAddress = this.props.formData.targetPayee
    const payee = this.props.contactList.find(contact => contact.address === payeeAddress)
    return payee ? payee.name : payeeAddress
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
            <section className="section has-centered">
              <div className="level">
                <div className="level-item">
                  <figure className="image is-64x64">
                    <img
                      src={this.props.currency === Currency.KAU ? kauLogo : kagLogo}
                      className="is-rounded"
                    />
                  </figure>
                </div>
              </div>
              <div className="level">
                <div className="level-item">
                  <h1 className="title has-text-weight-bold is-uppercase">Confirm transfer</h1>
                </div>
              </div>
            </section>
            <section className="columns is-vcentered">
              <AccountCard
                name={this.props.walletName}
                addressDisplay={AddressDisplay.account}
                address={this.props.activeAccount.keypair.publicKey()}
              />
              <div className="column is-narrow">
                <div className="level">
                  <div className="level-item">
                    <span className="has-text-grey-lighter is-size-2">
                      <i className="fal fa-arrow-circle-right" />
                    </span>
                  </div>
                </div>
              </div>
              <AccountCard
                name={this.getPayeeNameForAvatar()}
                address={this.props.formData.targetPayee}
                addressDisplay={AddressDisplay.payee}
              />
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
