import * as React from 'react'

import { addMetalColour } from '@helpers/walletUtils'

interface Summary {
  currency: string
  description: string
  amount: number
}

export const TransferSummary: React.SFC<Summary> = (props: Summary) => (
  <div className="level u-margin-bottom-sm-2">
    <div className="level-left">
      <div className="level-item has-text-grey-lighter">{props.description}</div>
    </div>
    <div className="level-right">
      <div className={`level-item ${addMetalColour(props.currency)}`}>
        {props.amount.toFixed(5)} {props.currency}
      </div>
    </div>
  </div>
)
