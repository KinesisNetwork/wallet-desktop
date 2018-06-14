import { addPayee, changeTransferView, updatePayeeForm } from '@actions'
import { PayeeForm as PayeeFormPresentation } from '@components'
import { Dispatch, RootState } from '@store'
import { Payee, TransferView } from '@types'
import { connect } from 'react-redux'

const mapStateToProps = ({ payees, view }: RootState) => ({
  payee: payees.form,
  activeWalletView: view.walletView,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addPayee: (payee: Payee) => dispatch(addPayee(payee)),
  handleChange: (field: keyof Payee, newValue: string) => dispatch(updatePayeeForm({ field, newValue })),
  cancelForm: () => dispatch(changeTransferView(TransferView.transfer)),
})

export const PayeeForm = connect(mapStateToProps, mapDispatchToProps)(PayeeFormPresentation)
