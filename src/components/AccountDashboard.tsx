import * as React from 'react'

import { CurrencySelector } from '@containers/CurrencySelector'
import { Transactions } from '@containers/Transactions'
// import { Transfer } from '@containers/Transfer'
// import { WalletInfo } from '@containers/WalletInfo'

import * as logo from '@icons/kau-icon.svg'
import { RootRoutes } from '@types'
import { NavLink } from 'react-router-dom'

export const AccountDashboard: React.SFC = () => (
  <React.Fragment>
    <div className="container">
      <CurrencySelector />
      <section className="section has-text-centered">
        <div className="level">
          <div className="level-item">
            <figure className="image is-128x128">
              <img src={logo} className="is-rounded" />
            </figure>
          </div>
        </div>
        <div className="level">
          <div className="level-item">
            <h1 className="title is-size-2 has-text-primary has-text-weight-bold">40.000 KAU</h1>
          </div>
        </div>
        <div className="level">
          <div className="level-item">
            <NavLink to={RootRoutes.dashboard + '/send'} className="button is-primary is-large">
              <span className="icon is-large">
                <i className="fal fa-arrow-up" />
              </span>
              <span>Send</span>
            </NavLink>
          </div>
        </div>
      </section>
      <Transactions />
    </div>
  </React.Fragment>
)

AccountDashboard.displayName = 'AccountDashboard'
