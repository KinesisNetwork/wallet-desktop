import { View } from '@types'
import * as React from 'react'

export interface Props {
  changeView: (view: View) => any
}

export const SidebarPayee: React.SFC<Props> = ({ changeView }) => (
  <div className='has-text-centered'>
    <button className='button is-outlined is-fullwidth' onClick={() => changeView(View.payees)}>
      Manage Payees
    </button>
  </div>
)
