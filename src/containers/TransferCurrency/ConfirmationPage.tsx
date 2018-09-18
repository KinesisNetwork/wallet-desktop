import { RootState } from '@store'
import * as React from 'react'
import { connect } from 'react-redux'

import * as kagLogo from '@icons/kag-icon.svg'
import * as kauLogo from '@icons/kau-icon.svg'

import { FromAccountHolder } from '@containers/TransferCurrency/FromAccountHolder';
import { Currency } from '@types'
import { AddToAddressBook } from './AddToAddressBook'

const mapStateToProps = (state: RootState) => ({
  currency: state.connections.currentCurrency,
  walletName: state.wallet.persisted.walletName,
})

type Props = ReturnType<typeof mapStateToProps>

export const ConfirmationPagePresentation: React.SFC<Props> = ({
  currency,
  walletName
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
          <section className="columns">
            <div className="column is-7">
              <FromAccountHolder walletName={walletName} />
            </div>
            <div className="column is-5">
              <AddToAddressBook recipientPublicKey='GDJ5YLMOAVKTA74F5QHOMYISQYZFZQMDZD5RPYLUNE6VSHDFCB3GY7LD' />
            </div>
          </section>
          <section className="section">
            <div className="columns is-centered">
              <div className="column is-two-thirds">
                <div className="has-text-centered content">
                  <h1 className={`is-size-1 has-text-weight-bold ${
                    currency === Currency.KAU ? 'has-text-primary' : 'has-text-grey-light'
                    }`}>
                    4.50 {currency}
                  </h1>
                  <p className="has-text-grey-lighter">
                    <q>This is a description</q>
                  </p>
                </div>
                <div className="is-divider" />
                <div className="level">
                  <div className="level-left">
                    <div className="level-item has-text-grey-lighter">Transaction fee</div>
                  </div>
                  <div className="level-right">
                    <div className="level-item has-text-primary">0.02025 {currency}</div>
                  </div>
                </div>
                <div className="is-divider" />
                <section className="field is-grouped is-grouped-right">
                  <p className="control">
                    <button
                      className="button is-primary is-outlined"
                      onClick={() => null}
                    >Back</button>
                  </p>
                  <p className="control">
                    <a className="button is-primary" onClick={() => null}>
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
  mapStateToProps
)(ConfirmationPagePresentation)

export { ConnectedConfirmationPage as ConfirmationPage }
