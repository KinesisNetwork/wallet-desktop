import { RootState } from '@store'
import * as React from 'react'
import { connect } from 'react-redux'

import * as kagLogo from '@icons/kag-icon.svg'
import * as kauLogo from '@icons/kau-icon.svg'

import { getInitials } from '@helpers/walletName'

import { Currency } from '@types'

const mapStateToProps = (state: RootState) => ({
  currency: state.connections.currentCurrency,
  walletName: state.wallet.persisted.walletName
})

type Props = ReturnType<typeof mapStateToProps>

export const ConfirmationPagePresentation: React.SFC<Props> = ({
  currency,
  walletName
}) => (
    <React.Fragment>
      <div className="columns is-mobile is-centered">
        <div className="column is-half">
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
            <div className="column is-5">
              <div className="box">
                <div className="level">
                  <div className="level-left">
                    <div className="level-item">
                      <div
                        className="image is-32x32 has-background-grey level-item"
                        style={{ borderRadius: '100px' }}
                      >
                        <span className="has-text-grey-light">
                          {getInitials(walletName)}
                        </span>
                      </div>
                    </div>
                    <div className="level-item">
                      <div className="has-text-grey-lighter">
                        Accountname
                  </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-2">
              <div className="level">
                <div className="level-item">
                  <span className="has-text-grey-lighter is-size-2">
                    <i className="fal fa-arrow-circle-right" />
                  </span>
                </div>
              </div>
            </div>
            <div className="column is-5">
              <div className="box">
                <div className="level">
                  <div className="level-left">
                    <div className="level-item">
                      <div
                        className="image is-32x32 has-background-grey level-item"
                        style={{ borderRadius: '100px' }}
                      >
                        <span className="has-text-grey-light">
                          {getInitials(walletName)}
                        </span>
                      </div>
                    </div>
                    <div className="level-item">
                      <div className="has-text-grey-lighter">
                        Accountname
                  </div>
                    </div>
                  </div>
                </div>
                <div>save to address book</div>
                <div>input element</div>
              </div>
            </div>
          </section>
          <section>Summary</section>
        </div>
      </div>
    </React.Fragment>
  )

const ConnectedConfirmationPage = connect(
  mapStateToProps
)(ConfirmationPagePresentation)

export { ConnectedConfirmationPage as ConfirmationPage }
