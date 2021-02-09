import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as React from 'react'
import { connect } from 'react-redux'

import { loadNextTransactionPage } from '@actions'
import { RootState } from '@store'

import { EmptyTransactions } from '@components/EmptyTransactions'
import { TransactionCard } from '@components/TransactionOperation'
import { ConnectionStage, TransactionOperationView } from '@types'

const mapStateToProps = ({
  transactions: { transactionOperations, isLoading },
  connections: { currentCurrency, currentStage },
}: RootState) => ({
  operations: transactionOperations,
  currency: currentCurrency,
  isLoading,
  isTestnet: currentStage === ConnectionStage.testnet,
})

const mapDispatchToProps = {
  loadNextTransactionPage,
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

class TransactionsPresentation extends React.Component<Props> {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    const { isLoading, operations } = this.props

    if (isLoading) {
      return (
        <div className="has-text-centered">
          <span className="icon">
            <FontAwesomeIcon icon={['fal', 'spinner']} size="3x" />
          </span>
        </div>
      )
    }

    if (operations.length === 0) {
      return <EmptyTransactions />
    }

    return this.groupOperationsByDate()
  }

  handleScroll = () => {
    const { loadNextTransactionPage: loadNextPage } = this.props

    const { scrollHeight, clientHeight, scrollTop } = document.documentElement
    const shouldTriggerLoad = scrollTop === scrollHeight - clientHeight
    if (shouldTriggerLoad) {
      loadNextPage()
    }
  }

  groupOperationsByDate = () => (
    <div onScroll={this.handleScroll}>
      {Object.entries(this.groupOperations()).map(([date, ops]) => (
        <React.Fragment key={date}>
          <h1 className="subtitle">{date}</h1>
          {ops.map(op => (
            <TransactionCard
              key={op.operation.id}
              transactionWithOperation={op}
              currency={this.props.currency}
              isTestnet={this.props.isTestnet}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  )

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
