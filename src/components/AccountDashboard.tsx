import * as React from 'react'

import {
  Transactions,
  Transfer,
  WalletInfo,
} from '@containers'

export const AccountDashboard: React.SFC = () => (
  <React.Fragment>
    <div className='columns is-constant-height'>
      <div className='column'>
        <WalletInfo />
      </div>
      <div className='column'>
        <Transfer />
      </div>
    </div>
    <Transactions />
  </React.Fragment>
)
