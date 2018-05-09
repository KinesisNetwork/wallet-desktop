import { connect } from 'react-redux'
import { RootState } from '@store'
import { WalletInfo as WalletInfoPresentation } from '@components'

const mapStateToProps = ({accounts, wallets}: RootState) => {
  const {accountName, publicKey} = wallets.walletList[wallets.currentlySelected]
  const activeAccount = accounts.accountsMap[publicKey]
  return {
    accountName,
    publicKey,
    isAccountLoading: accounts.isAccountLoading,
    accountBalance: activeAccount.balance,
  }
}

export const WalletInfo = connect(mapStateToProps)(WalletInfoPresentation)
