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
    <div className='has-text-centered title-heading is-constant-height'>
      <Password />
      <AccountPage />
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
