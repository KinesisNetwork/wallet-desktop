import * as React from 'react'
import { connect } from 'react-redux'

import * as kagLogo from '@icons/kag-icon.svg'
import * as kauLogo from '@icons/kau-icon.svg'

import { InputField } from '@components/InputField';
import { RootState } from '@store'
import { Currency } from '@types'

const mapStateToProps = (state: RootState) => ({
  currency: state.connections.currentCurrency,
  balance: state.accounts.accountInfo.balance
})

type Props = ReturnType<typeof mapStateToProps>

const TransferCurrencyPresentation: React.SFC<Props> = (props) => (
  <React.Fragment>
    <div className="columns is-mobile is-centered">
      <div className="column is-one-third">
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
              <h1 className={`title has-text-weight-bold is-uppercase ${
                props.currency === Currency.KAU ? 'has-text-primary' : 'has-text-grey-light'
                }`}>
                Send {props.currency}
              </h1>
            </div>
          </div>
          <div className="level">
            <div className="level-item has-text-grey-lighter">
              {props.balance} Available
            </div>
          </div>
        </section>
        <form>
          <InputField
            id='transfer-to'
            value=''
            onChangeHandler={() => null}
            label='To'
            placeholder='Recipient Address'
            icon='fa-chevron-down'
          />
          <InputField
            id='transfer-amount'
            value=''
            placeholder={`0 ${props.currency}`}
            onChangeHandler={() => null}
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
          <div className="column">
            <div>Transaction fee</div>
            <div>Remaining balance</div>
          </div>
          <div className="column is-primary">
            <div>0.00 KAU</div>
            <div>41.1807 KAU</div>
          </div>
        </section>
        <section className="field is-grouped">
          <p className="control">
            <a className="button">Cancel</a>
          </p>
          <p className="control">
            <a className="button">
              <span className="icon"><i className="fal fa-arrow-up" /></span>
              <span>Send</span>
            </a>
          </p>
        </section>
      </div>
    </div>
  </React.Fragment>
)

const ConnectedTransferCurrency = connect(
  mapStateToProps
)(TransferCurrencyPresentation)

export { ConnectedTransferCurrency as TransferCurrency }
