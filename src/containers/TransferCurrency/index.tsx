import * as React from 'react'

import * as kagLogo from '@icons/kag-icon.svg'
import * as kauLogo from '@icons/kau-icon.svg'

import { RootState } from '@store';
import { Currency } from '@types'

const mapStateToProps = (state: RootState) => ({
  currency: state.connections.currentCurrency,
  balance: state.accounts.accountInfo.balance
})

type Props = ReturnType<typeof mapStateToProps>

const TransferCurrency: React.SFC<Props> = (props) => (
  <React.Fragment>
    <div className="columns is-mobile is-centered">
      <div className="column is-one-third-fullwidth">
        <section className="section has-text-centered">
          <div className="level">
            <div className="level-item">
              <figure className="image is-128x128">
                <img src={props.currency === Currency.KAU ? kauLogo : kagLogo} className="is-rounded" />
              </figure>
            </div>
          </div>
          <div className="level">
            <div className="level-item">
              <h1 className="title has-text-weight-bold is-uppercase">
                Send {props.currency}
              </h1>
            </div>
          </div>
          <div className="level">
            <div className="level-item">
              {props.balance} Available
            </div>
          </div>
        </section>
        <div>Inputs</div>
      </div>
    </div>
  </React.Fragment>
)

export { TransferCurrency }
