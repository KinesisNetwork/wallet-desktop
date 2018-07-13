import { connect } from 'react-redux'

import { loadNextTransactionPage } from '@actions'
import { Transactions as TransactionsPresentation } from '@components/Transactions'
import { RootState } from '@store'

const mapStateToProps = ({transactions}: RootState) => ({
  isLastPage: transactions.isLastPage,
  isLoading: transactions.isLoading,
  operations: transactions.transactionOperations,
})

const mapDispatchToProps = {
  loadNextTransactionPage,
}

export const Transactions = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransactionsPresentation)
