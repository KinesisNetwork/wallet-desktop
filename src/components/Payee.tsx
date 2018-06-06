import * as React from 'react'

import {
  PayeeList,
  PayeeSet,
} from '@containers'

export const Payee: React.SFC = () => (
  <div className='columns'>
    <div className='column is-half'>
      <PayeeList />
    </div>
    <div className='column'>
      <PayeeSet />
    </div>
  </div>
)
