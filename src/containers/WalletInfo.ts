import { connect } from 'react-redux'

import { WalletInfo as WalletInfoPresentation } from '@components/WalletInfo'
import { RootState } from '@store'
import { Wallet } from '@types'

const mapStateToProps = ({ accounts, wallets }: RootState) => {
  const { accountName, publicKey } = wallets.activeWallet as Wallet
  const activeAccount = accounts.accountsMap[publicKey]
  return {
    accountName,
    publicKey,
    accountBalance: activeAccount.balance,
    isAccountLoading: accounts.isAccountLoading,
  }
}

export const WalletInfo = connect(mapStateToProps)(WalletInfoPresentation)
