import { PayeeList as PayeeListPresentation } from '@components'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({payees}: RootState) => {
  return {
    payees: payees.payees,
  }
}

export const PayeeList = connect(mapStateToProps)(PayeeListPresentation)
