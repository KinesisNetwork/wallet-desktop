import {
  Password,
  Transactions,
  Transfer,
  WalletInfo,
} from '@containers'
import * as React from 'react'

export const Dashboard: React.SFC = () => (
  <div className='vertical-spaced'>
    <div className='has-text-centered title-heading'>
      <Password />
    </div>
    <div className='columns'>
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
