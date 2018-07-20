import { updateSignTransactionForm } from '@actions'
import { SignTransactionForm as SignTransactionFormPresentation } from '@components'
import { RootState } from '@store'
import { Wallet } from '@types'
import { connect } from 'react-redux'

const mapStateToProps = ({ sign, passwords, wallets, connections }: RootState) => ({
  message: sign.signTransactionData.message,
  decryptedPrivateKey: () => passwords.livePasswords[(wallets.activeWallet as Wallet).publicKey].privateKey,
  connection: connections.currentConnection,
})

const mapDispatchToProps = {
  updateSignTransactionForm,
}

export type SignTransactionFormProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
export const SignTransactionForm = connect(mapStateToProps, mapDispatchToProps)(SignTransactionFormPresentation)
