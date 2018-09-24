import { connect } from 'react-redux'

import { addPayee, changeTransferView, invalidForm, updatePayeeForm } from '@actions'
import { PayeeForm as PayeeFormPresentation } from '@components/PayeeForm'
import { Dispatch, RootState } from '@store'
import { FormAlert, Payee, TransferView } from '@types'

const mapStateToProps = ({ payees, view }: RootState) => ({
  payee: payees.form,
  activeWalletView: view.walletView,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addPayee: (payee: Payee) => dispatch(addPayee(payee)),
  handleChange: (field: keyof Payee, newValue: string) =>
    dispatch(updatePayeeForm({ field, newValue })),
  cancelForm: () => dispatch(changeTransferView(TransferView.transfer)),
  formIsInvalid: (error: FormAlert) => dispatch(invalidForm(error)),
})

export const PayeeForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PayeeFormPresentation)
