import { connect } from 'react-redux'

import { transactionRequest, updateSignTransactionForm } from '@actions'
import { SignTransactionForm as SignTransactionFormPresentation } from '@components/SignTransactionForm'
import { getCurrentConnection } from '@selectors'
import { RootState } from '@store'
import { Wallet } from '@types'

const mapStateToProps = ({ sign, passwords, wallets, transfer, connections }: RootState) => ({
  message: sign.signTransactionData.message,
  decryptedPrivateKey: () =>
    passwords.livePasswords[(wallets.activeWallet as Wallet).publicKey].privateKey,
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
