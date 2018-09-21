import { RootState } from '@store'
import * as React from 'react'
import { connect } from 'react-redux'

import * as kagLogo from '@icons/kag-icon.svg'
import * as kauLogo from '@icons/kau-icon.svg'

import { AccountCard } from '@containers/TransferCurrency/AccountCard';
import { TransferSummary } from '@containers/TransferCurrency/TransferSummary'
import { addMetalColour } from '@helpers/walletUtils'
import { Currency, RootRoutes } from '@types'
import { goBack, replace } from 'connected-react-router';

import { getInitials } from '@helpers/walletUtils'

const mapStateToProps = (state: RootState) => ({
  currency: state.connections.currentCurrency,
  walletName: state.wallet.persisted.walletName,
  contactName: state.transfer.formData.contactName
})

const mapDispatchToProps = {
  goBackToTransformPage: () => goBack(),
  confirmAndGoToDashboard: () => replace(RootRoutes.dashboard)
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

export const ConfirmationPagePresentation: React.SFC<Props> = ({
  currency,
  walletName,
  goBackToTransformPage,
  confirmAndGoToDashboard,
  contactName
}) => (
    <React.Fragment>
      <div className="columns is-mobile is-centered">
        <div className="column is-three-fifths">
          <section className="section has-centered">
            <div className="level">
              <div className="level-item">
                <figure className="image is-64x64">
                  <img src={currency === Currency.KAU ? kauLogo : kagLogo} className="is-rounded" />
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
            <AccountCard inititals={getInitials(walletName)} accountName='Account 1' />
            <div className="column is-narrow">
              <div className="level">
                <div className="level-item">
                  <span className="has-text-grey-lighter is-size-2">
                    <i className="fal fa-arrow-circle-right" />
                  </span>
                </div>
              </div>
            </div>
            <AccountCard payeeName={contactName} icon='fa-user-circle' />
          </section>
          <section className="section">
            <div className="columns is-centered">
              <div className="column is-two-thirds">
                <div className="has-text-centered content">
                  <h1 className={`is-size-1 has-text-weight-bold ${addMetalColour(currency)}`}>
                    4.50 {currency}
                  </h1>
                  <p className="has-text-grey-lighter">
                    <q>This is a description</q>
                  </p>
                </div>
                <hr className="has-background-grey-lighter" />
                <TransferSummary
                  currency={currency}
                  description="Transaction fee"
                  amount='0.02025'
                />
                <hr className="has-background-grey-lighter" />
                <TransferSummary
                  currency={currency}
                  description="TOTAL"
                  amount='4.52025'
                />
                <hr className="has-background-grey-lighter" />
                <section className="field is-grouped is-grouped-right">
                  <p className="control">
                    <button
                      className="button is-text"
                      onClick={goBackToTransformPage}
                    >Back</button>
                  </p>
                  <p className="control">
                    <a className="button is-primary" onClick={confirmAndGoToDashboard}>
                      <span className="icon"><i className="fal fa-arrow-up" /></span>
                      <span>Confirm</span>
                    </a>
                  </p>
                </section>
              </div>
            </div>
          </section>
        </div>
      </div>
    </React.Fragment >
  )

const ConnectedConfirmationPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmationPagePresentation)

export { ConnectedConfirmationPage as ConfirmationPage }
