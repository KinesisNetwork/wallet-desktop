import { connect } from 'react-redux'

import { WalletInfo as WalletInfoPresentation } from '@components/WalletInfo'
import { getActiveAccount } from '@selectors'
import { RootState } from '@store'

const mapStateToProps = (state: RootState) => {
  const activeAccount = getActiveAccount(state.wallet)
  return {
    accountName: activeAccount.name,
    publicKey: activeAccount.keypair.publicKey(),
    accountBalance: 0,
    isAccountLoading: false,
  }
}

export const WalletInfo = connect(mapStateToProps)(WalletInfoPresentation)
