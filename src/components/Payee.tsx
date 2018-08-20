import * as React from 'react'

import { PayeeForm } from '@containers/PayeeForm'
import { PayeeList } from '@containers/PayeeList'

export const Payee: React.SFC = () => (
  <div className='columns'>
    <div className='column is-half'>
      <PayeeList />
    </div>
    <div className='column'>
      <div className='vertical-spaced has-text-centered'>
        <h1 className='title-heading'>ADD A NEW PAYEE</h1>
        <section className='section'>
          <PayeeForm />
        </section>
      </div>
    </div>
  </div>
)

Payee.displayName = 'Payee'
