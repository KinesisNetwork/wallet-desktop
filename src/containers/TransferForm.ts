import { connect } from 'react-redux'

import {
  changeTransferView,
  changeWalletView,
  transferRequest,
  updateTransferForm,
} from '@actions'
import { TransferForm as TransferPresentation } from '@components/TransferForm'
import { getFeeInKinesis } from '@services/kinesis'
import { RootState } from '@store'
import { Payee, Wallet } from '@types'

export const mapStateToProps = ({ wallets, connections, transfer, accounts, payees, passwords }: RootState) => {
  const activeWallet = wallets.activeWallet as Wallet
  const livePassword = passwords.livePasswords[activeWallet.publicKey]
  const otherWalletsAsPayees: Payee[] = wallets.walletList
    .filter((wallet) => wallet.publicKey !== activeWallet.publicKey)
    .map((wallet): Payee => ({ name: wallet.accountName, publicKey: wallet.publicKey }))
  return {
    ...transfer.form,
    getFee: (amount: number) => getFeeInKinesis(connections.currentConnection, amount),
    isTransferring: transfer.isTransferring,
    isWalletUnlocked: !!livePassword,
    accountBalance: accounts.accountsMap[activeWallet.publicKey].balance,
    payees: payees.payees.concat(otherWalletsAsPayees),
    activeWallet,
    connection: connections.currentConnection,
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
