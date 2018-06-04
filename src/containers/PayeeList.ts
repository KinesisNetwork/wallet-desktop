import { removePayee } from '@actions'
import { PayeeList as PayeeListPresentation } from '@components'
import { Dispatch, RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({payees}: RootState) => {
  return {
    payees: payees.payees,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  removePayee: (payeeName: string): void => {
    dispatch(removePayee(payeeName))
  },
})

export const PayeeList = connect(mapStateToProps, mapDispatchToProps)(PayeeListPresentation)
