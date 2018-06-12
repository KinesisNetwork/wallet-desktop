import * as React from 'react'

import {
  Password,
  Transactions,
  Transfer,
  WalletInfo,
} from '@containers'

export const Dashboard: React.SFC = () => (
  <div className='vertical-spaced'>
    <div className='has-text-centered title-heading is-constant-height'>
      <Password />
    </div>
    <div className='columns is-constant-height'>
      <div className='column is-half'>
        <WalletInfo />
      </div>
      <div className='column is-half'>
        <Transfer />
      </div>
    </div>
    <Transactions />
  </div>
)
