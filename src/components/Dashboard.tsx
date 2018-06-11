import * as React from 'react'

import {
  AccountPage,
  Password,
  Transactions,
  Transfer,
  WalletInfo,
} from '@containers'

export const Dashboard: React.SFC = () => (
  <div className='vertical-spaced'>
    <div className='columns'>
      <div className='has-text-centered is-constant-height column is-four-fifths'>
        <Password />
      </div>
      <div className='column'>
        <AccountPage />
      </div>
    </div>
    <div className='columns is-constant-height'>
      <div className='column'>
        <WalletInfo />
      </div>
      <div className='column'>
        <Transfer />
      </div>
    </div>
    <Transactions />
  </div>
)
