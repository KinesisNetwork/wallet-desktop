import * as React from 'react'
import { Transaction } from 'stellar-sdk'
import { OperationView } from './Operation'

export interface IProps {
  transaction: Transaction
}

export const TransactionView: React.SFC<IProps> = ({transaction}) => (
  <div>
    <h1 className='title'>Operations</h1>
    <div>
      { transaction.operations.map((op, i) => ( <OperationView operation={op} key={i} />)) }
    </div>
  </div>
)
