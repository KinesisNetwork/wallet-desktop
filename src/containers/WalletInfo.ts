import { connect } from 'react-redux'
import { Connection } from '@types'
import { Dispatch, RootState } from '@store'
import { WalletInfo as WalletInfoPresentation } from '@components'
import {
  accountLoadFailure,
  accountLoadRequest,
  accountLoadSuccess,
} from '@actions'
import { loadAccount } from '@services/accounts'

const mapStateToProps = ({accounts, wallets, connections}: RootState) => {
  const {accountName, publicKey} = wallets.walletList[wallets.currentlySelected]
  const activeAccount = accounts.accountsMap[publicKey]
  return {
    accountName,
    publicKey,
    isAccountLoading: accounts.isAccountLoading,
    connection: connections.currentConnection,
    accountBalance: activeAccount.balance,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadAccount: async (publicKey: string, connection: Connection) => {
    dispatch(accountLoadRequest(publicKey))
    try {
      const account = await loadAccount(publicKey, connection)
      dispatch(accountLoadSuccess(account))
    } catch (e) {
      dispatch(accountLoadFailure(e))
    }
  }
})

export const WalletInfo = connect(mapStateToProps, mapDispatchToProps)(WalletInfoPresentation)
