import { addMetalColour } from '@helpers/walletUtils'
import * as React from 'react'

interface Amount {
  amount: string | number
  text: string
  currency: string
  isTestnet?: boolean
}

export const AmountPresentation: React.SFC<Amount> = (props: Amount) => {
  const decimalPlaces = props.currency === 'KEM' ? 7 : 5
  return (
    <div className="level">
      <div className="level-item">
        <h1 className={`title is-size-2 has-text-weight-bold ${addMetalColour(props.currency)}`}>
          {Number(props.amount).toFixed(decimalPlaces)}{' '}
          {props.isTestnet ? 'T' + props.text : props.text}
        </h1>
      </div>
    </div>
  )
}
