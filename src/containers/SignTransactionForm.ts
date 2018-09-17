import { connect } from 'react-redux'

import { transactionRequest, updateSignTransactionForm } from '@actions'
import { SignTransactionForm as SignTransactionFormPresentation } from '@components/SignTransactionForm'
import { getActiveAccount, getCurrentConnection } from '@selectors'
import { RootState } from '@store'

const mapStateToProps = ({ sign, wallet, transfer, connections }: RootState) => ({
  message: sign.signTransactionData.message,
  decryptedPrivateKey: () => getActiveAccount(wallet).keypair.secret(),
  submissionPending: transfer.isTransferring,
  connection: getCurrentConnection(connections),
})

const mapDispatchToProps = {
  updateSignTransactionForm,
  transactionRequest,
}

export type SignTransactionFormProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps
export const SignTransactionForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignTransactionFormPresentation)
