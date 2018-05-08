import * as React from 'react'
import {
  Password,
  WalletInfo,
} from '@containers'

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
        {/* <Transfers /> */}
      </div>
    </div>
    <div style={{flexShrink: 10}}>
      {/* <Transactions /> */}
    </div>
  </div>
)
