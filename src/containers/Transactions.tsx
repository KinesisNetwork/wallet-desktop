import * as React from 'react'
import { connect } from 'react-redux'

import { loadNextTransactionPage } from '@actions'
// import { Transactions as TransactionsPresentation } from '@components/Transactions'
import { RootState } from '@store'

import { EmptyTransactions } from '@components/EmptyTransactions'
import { TransactionCard } from '@components/TransactionOperation'
import { TransactionOperationView } from '@types'

const mapStateToProps = ({ transactions }: RootState) => ({
  isLastPage: transactions.isLastPage,
  isLoading: transactions.isLoading,
  operations: transactions.transactionOperations,
})

const mapDispatchToProps = {
  loadNextTransactionPage,
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

class TransactionsPresentation extends React.Component<Props> {
  render() {
    if (this.props.operations.length === 0) {
      return <EmptyTransactions />
    }
    return this.groupByDate()
  }

  groupByDate = () =>
    Object.entries(this.groupOperations()).map(([date, ops]) => (
      <div key={date}>
        <h1 className="subtitle">{date}</h1>
        {ops.map(op => <TransactionCard key={op.operation.id} transactionWithOperation={op} />)}
      </div>
    ))

  groupOperations = (): { [date: string]: TransactionOperationView[] } =>
    this.props.operations.reduce((acc, op) => {
      const date = op.date.toDateString()
      const value = acc[date] || []
      acc[date] = [...value, op]
      return acc
    }, {})
}

export const Transactions = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransactionsPresentation)
