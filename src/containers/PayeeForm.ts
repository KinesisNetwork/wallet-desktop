import { changeTransferView, setPayee, updatePayeeForm } from '@actions'
import { PayeeForm as PayeeFormPresentation } from '@components'
import { Dispatch, RootState } from '@store'
import { Payee, TransferView } from '@types'
import { connect } from 'react-redux'

const mapStateToProps = ({ payees, view }: RootState) => ({
  payee: payees.form,
  currentWalletView: view.walletView,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setPayee: (payee: Payee): void => {
    dispatch(setPayee(payee))
  },
  handleChange: (field: keyof Payee, newValue: string) => {
    dispatch(updatePayeeForm({ field, newValue }))
  },
  changeTransferView: () => dispatch(changeTransferView(TransferView.transfer)),
})

export const PayeeForm = connect(mapStateToProps, mapDispatchToProps)(PayeeFormPresentation)
