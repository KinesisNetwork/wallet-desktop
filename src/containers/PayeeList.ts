import { connect } from 'react-redux'

import { removePayee } from '@actions'
import { PayeeList as PayeeListPresentation } from '@components/PayeeList'
import { Dispatch, RootState } from '@store'

const mapStateToProps = ({ payees }: RootState) => {
  return {
    payees: payees.payees,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  removePayee: (payeeName: string) => dispatch(removePayee(payeeName)),
})

export const PayeeList = connect(mapStateToProps, mapDispatchToProps)(PayeeListPresentation)
