import { connect } from 'react-redux'

import { transactionRequest, updateSignTransactionForm } from '@actions'
import { SignTransactionForm as SignTransactionFormPresentation } from '@components/SignTransactionForm'
import { getActiveAccount, getCurrentConnection } from '@selectors'
import {
  getEmissionKeyInContactFormat,
  getInactiveAccountsInContactFormat,
} from '@services/accounts'
import { RootState } from '@store'

const mapStateToProps = ({ contacts, sign, wallet, transfer, connections }: RootState) => ({
  message: sign.signTransactionData.message,
  decryptedPrivateKey: () => getActiveAccount(wallet).keypair.secret(),
  submissionPending: transfer.isTransferring,
  connection: getCurrentConnection(connections),
  addressInBook: contacts.contactList.concat(
    getInactiveAccountsInContactFormat(wallet.accounts, getActiveAccount(wallet)).concat(
      getEmissionKeyInContactFormat(),
    ),
  ),
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
