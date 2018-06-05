import { clearPayeeForm, setPayee, updatePayeeForm } from '@actions'
import { PayeeSet as PayeeSetPresentation } from '@components'
import { Dispatch, RootState } from '@store'
import { Payee } from '@types'
import { connect } from 'react-redux'

const mapStateToProps = ({payees}: RootState) => ({
  payee: payees.form,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setPayee: (payee: Payee): void => {
    dispatch(setPayee(payee))
    dispatch(clearPayeeForm())
  },
  handleChange: (field: keyof Payee, newValue: string) => {
    dispatch(updatePayeeForm({field, newValue}))
  },
})

export const PayeeSet = connect(mapStateToProps, mapDispatchToProps)(PayeeSetPresentation)
