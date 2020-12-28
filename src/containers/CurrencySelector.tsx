import * as React from 'react'
import { connect } from 'react-redux'

import { selectConnectedCurrency } from '@actions'
import { RootState } from '@store'
import { Currency } from '@types'

const mapStateToProps = (state: RootState) => ({
  activeCurrency: state.connections.currentCurrency,
})

const mapDispatchToProps = {
  selectConnectedCurrency,
}

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>

const CurrencySelectorPresentation: React.SFC<Props> = props => (
  <div className="tabs is-large ">
    <ul>
      <li className={props.activeCurrency === Currency.KAU ? 'is-active' : ''}>
        <a onClick={() => props.selectConnectedCurrency(Currency.KAU)}>
          <span className="icon is-small">
            <i className="fal fa-cubes" />
          </span>
          <span>KAU</span>
        </a>
      </li>
      <li className={props.activeCurrency === Currency.KAG ? 'is-active' : ''}>
        <a onClick={() => props.selectConnectedCurrency(Currency.KAG)}>
          <span className="icon is-small">
            <i className="fal fa-cubes" />
          </span>
          <span>KAG</span>
        </a>
      </li>
      <li className={props.activeCurrency === Currency.KEM ? 'is-active' : ''}>
        <a onClick={() => props.selectConnectedCurrency(Currency.KEM)}>
          <span className="icon is-small">
            <i className="fal fa-cubes" />
          </span>
          <span>KEM</span>
        </a>
      </li>
    </ul>
  </div>
)

export const CurrencySelector = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CurrencySelectorPresentation)
