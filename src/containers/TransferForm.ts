import { connect } from 'react-redux'

import { changeTransferView, changeWalletView, transferRequest, updateTransferForm } from '@actions'
import { TransferForm as TransferPresentation } from '@components/TransferForm'
import { getActiveKeys, getCurrentConnection } from '@selectors'
import { getFeeInKinesis } from '@services/kinesis'
import { RootState } from '@store'
import { Payee } from '@types'

export const mapStateToProps = (state: RootState) => {
  const { wallets, connections, transfer, accounts, payees } = state
  const { privateKey, publicKey } = getActiveKeys(state)
  const otherWalletsAsPayees: Payee[] = wallets.walletList
    .filter(wallet => wallet.publicKey !== publicKey)
    .map((wallet): Payee => ({ name: wallet.accountName, publicKey: wallet.publicKey }))
  return {
    ...transfer.form,
    getFee: (amount: number) => getFeeInKinesis(getCurrentConnection(connections), amount),
    isTransferring: transfer.isTransferring,
    isWalletUnlocked: !!privateKey,
    accountBalance: accounts.accountInfo.balance,
    payees: payees.payeesList.concat(otherWalletsAsPayees),
    publicKey,
    connection: getCurrentConnection(connections),
  }
}

const mapDispatchToProps = {
  changeWalletView,
  changeTransferView,
  transferRequest,
  updateTransferForm,
}

export type TransferProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
export const TransferForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransferPresentation)
