import * as React from 'react'

interface Confirmed {
  amount: string
  currency: string
  recipient: string
  account: string
}

export const TransactionConfirmationMessage: React.SFC<Confirmed> = (props: Confirmed) => (
  <div className="notification is-success" style={{ width: '90%' }}>
    <div className="level">
      <div className="level-left">
        <div className="level-item">
          <span className="is-size-4"><i className="fal fa-check-circle" /></span>
          <span className="u-margin-left-xs">Transaction confirmed! {props.amount} {props.currency} has been sent to {props.recipient} from {props.account}</span>
        </div>
      </div>
      <div className="level-right">
        <span className="level-item is-size-4"><i className="fal fa-times" /></span>
      </div>
    </div>
  </div>
)
