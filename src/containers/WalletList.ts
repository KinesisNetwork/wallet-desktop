import { changeWalletView, deleteWallet, selectWallet } from '@actions'
import { getPasswordConfirmation, WalletList as WalletsPresentation } from '@components'
import { Dispatch, RootState } from '@store'
import { Wallet, WalletView } from '@types'
import { connect } from 'react-redux'

const mapStateToProps = ({ wallets, view }: RootState) => ({
  currentWallet: view.walletView === WalletView.dashboard ? wallets.currentlySelected : -1,
  wallets: wallets.walletList,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addWallet: () => dispatch(changeWalletView(WalletView.create)),
  selectWallet: (walletIndex: number) => {
    dispatch(selectWallet(walletIndex))
    dispatch(changeWalletView(WalletView.dashboard))
  },
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

export const WalletList = connect(mapStateToProps, mapDispatchToProps)(WalletsPresentation)
