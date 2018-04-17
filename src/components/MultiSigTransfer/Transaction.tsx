import * as React from 'react'
import { Transaction } from 'js-kinesis-sdk'
import { OperationView } from './Operation'

export interface IProps {
  transaction: Transaction
}

export const TransactionView: React.SFC<IProps> = ({transaction}) => (
  <div>
    { transaction.operations.map((op, i) => {
        op.source = op.source || transaction.source
        return (<OperationView operation={op} key={i} />)
      })
    }
  </div>
)
