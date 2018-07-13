import * as React from 'react'

import { Transactions } from '@containers/Transactions'
import { Transfer } from '@containers/Transfer'
import { WalletInfo } from '@containers/WalletInfo'

export const AccountDashboard: React.SFC = () => (
  <React.Fragment>
    <div className='columns is-constant-height'>
      <div className='column is-half'>
        <WalletInfo />
      </div>
      <div className='column is-half'>
        <Transfer />
      </div>
    </div>
    <Transactions />
  </React.Fragment>
)
