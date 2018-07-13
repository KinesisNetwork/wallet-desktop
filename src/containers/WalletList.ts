import { connect } from 'react-redux'

import {
  changeWalletView,
  deleteWallet,
  selectWallet,
} from '@actions'
import { getPasswordConfirmation } from '@components/PasswordConfirmation'
import { WalletList as WalletPresentation } from '@components/WalletList'
import {
  Dispatch,
  RootState,
} from '@store'
import {
  Wallet,
  WalletView,
} from '@types'

const mapStateToProps = ({ wallets, view }: RootState) => ({
  activeWallet: view.walletView === WalletView.dashboard ? wallets.activeWallet : null,
  wallets: wallets.walletList,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addWallet: () => dispatch(changeWalletView(WalletView.create)),
  selectWallet: (walletIndex: Wallet) => dispatch(selectWallet(walletIndex)),
  deleteWallet: async (wallet: Wallet) => {
    const isSureToDelete = await sweetAlert({
      buttons: ['Go back', 'Delete Account'],
      dangerMode: true,
      icon: 'warning',
      text: 'Once deleted, you will not be able to recover this account.',
      title: 'Are you sure?',
    })
    if (!isSureToDelete) {
      return
    }

    const { value: decryptedPrivateKeyOrEmpty } = await getPasswordConfirmation(wallet)
    if (decryptedPrivateKeyOrEmpty !== '') {
      dispatch(deleteWallet({ ...wallet, decryptedPrivateKey: decryptedPrivateKeyOrEmpty }))
    }
  },
})

export const WalletList = connect(mapStateToProps, mapDispatchToProps)(WalletPresentation)
