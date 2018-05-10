import { loadNextTransactionPage } from '@actions'
import { Transactions as TransactionsPresentation } from '@components'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({transactions}: RootState) => ({
  isLastPage: transactions.isLastPage,
  operations: transactions.transactionOperations,
})

const mapDispatchToProps = {
  loadNextTransactionPage,
}

export const Transactions = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransactionsPresentation)
