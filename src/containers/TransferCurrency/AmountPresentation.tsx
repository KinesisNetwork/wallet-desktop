import { addMetalColour } from '@helpers/walletUtils'
import * as React from 'react'

interface Amount {
  amount: string | number
  text: string
  currency: string
}

export const AmountPresentation: React.SFC<Amount> = (props: Amount) => {
  let length = 5
  if (props.currency === 'KEM') {
    length = 7
  }
  return (
    <div className="level">
      <div className="level-item">
        <h1 className={`title is-size-2 has-text-weight-bold ${addMetalColour(props.currency)}`}>
          {Number(props.amount).toFixed(length)} {props.text}
          {/* {Number(props.amount).toFixed(5)} {props.text} */}
        </h1>
      </div>
    </div>
  )
}
