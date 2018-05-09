import { connect } from 'react-redux'
import { Dispatch, RootState } from '@store'
import { WalletInfo as WalletInfoPresentation } from '@components'
import { accountLoadRequest } from '@actions'

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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadAccount: (publicKey: string) => {
    dispatch(accountLoadRequest(publicKey))
  }
})

export const WalletInfo = connect(mapStateToProps, mapDispatchToProps)(WalletInfoPresentation)
