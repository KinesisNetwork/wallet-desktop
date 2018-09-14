import * as sleeping from 'images/wally-sleeping.svg'
import * as React from 'react'

const EmptyTransactions = props => (
  <div className="level">
    <div className="level-item">
      <img src={sleeping} style={{ height: '200px' }} />
    </div>
    <div className="level-item">
      <div>
        <h2 className="subtitle">There's nothing here...</h2>
        <h2 className="subtitle">
          Once {props.currency} transactions have been made, we'll show the history here!
        </h2>
        <h2 className="subtitle">Need to buy Kinesis?</h2>
        <div>
          <a>Visit the exchange</a>
        </div>
      </div>
    </div>
  </div>
)

export { EmptyTransactions }
