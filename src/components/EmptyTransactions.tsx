import * as React from 'react'
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'

import * as sleeping from 'images/wally-sleeping.svg'

const EmptyTransactions = props => (
  <div className="level">
    <div className="level-item">
      <SVG src={sleeping} />
    </div>
    <div className="level-item">
      <div>
        <h2 className="subtitle">There's nothing here...</h2>
        <h2 className="subtitle">
          Once {props.currency} transactions have been made, we'll show the history here!
        </h2>
        <h2 className="subtitle">Need to buy Kinesis?</h2>
        <div>
          <Link to="/exchange">Visit the exchange.</Link>
        </div>
      </div>
    </div>
  </div>
)

export { EmptyTransactions }
