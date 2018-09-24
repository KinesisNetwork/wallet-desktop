import * as React from 'react'

import { PayeeForm } from '@containers/PayeeForm'
import { TransferForm } from '@containers/TransferForm'
import { TransferView } from '@types'

export interface Props {
  transferView: TransferView
}
export const Transfer: React.SFC<Props> = ({ transferView }) => {
  return (
    <React.Fragment>
      <h1 className="sub-heading primary-font">
        <span style={{ paddingRight: '5px' }}>Transfer</span>
        <span className="has-text-primary">KAU</span>
      </h1>
      {transferView === TransferView.transfer && <TransferForm />}
      {transferView === TransferView.addPayee && <PayeeForm />}
      <div
        className="is-divider is-hidden-tablet"
        style={{ marginBottom: 0, borderTopWidth: '0.01rem' }}
      />
    </React.Fragment>
  )
}

Transfer.displayName = 'Transfer'
