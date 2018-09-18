import * as React from 'react'

import { addMetalColour } from '@helpers/walletUtils'

interface Summary {
  currency: string
  description: string
  amount: string
}

export const TransferSummary: React.SFC<Summary> = (props: Summary) => (
  <div className="level u-margin-bottom-sm-2">
    <div className="level-left">
      <div className="level-item has-text-grey-lighter">{props.description}</div>
    </div>
    <div className="level-right">
      <div className={`level-item ${addMetalColour(props.currency)}`}>{props.amount} {props.currency}</div>
    </div>
  </div>
)
