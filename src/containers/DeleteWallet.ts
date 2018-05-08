import { connect } from 'react-redux'
import { RootState, Dispatch } from '@store'
import { DeleteWallet as DeleteWalletPresentation } from '@components'
import { getPasswordConfirmation } from 'components/helpers';
import { Wallet } from '@types';
import { deleteWallet } from '@actions';

const mapStateToProps = ({wallets}: RootState) => ({
  activeWallet: wallets.walletList[wallets.currentlySelected],
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  deleteWallet: async (currentWallet: Wallet) => {
    const isSureToDelete = await sweetAlert({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this wallet.',
      icon: 'warning',
      dangerMode: true,
      buttons: ['Go back', 'Delete Wallet'],
    })
    if (!isSureToDelete) {
      return
    }
    const continueWithDelete = await getPasswordConfirmation(currentWallet)
    if (continueWithDelete) {
      dispatch(deleteWallet(currentWallet))
    }
  }
})

export const DeleteWallet = connect(mapStateToProps, mapDispatchToProps)(DeleteWalletPresentation)
