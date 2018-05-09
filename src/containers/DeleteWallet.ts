import { connect } from 'react-redux'
import { RootState } from '@store'
import { DeleteWallet as DeleteWalletPresentation } from '@components'
import { deleteWallet } from '@actions';

const mapStateToProps = ({wallets}: RootState) => ({
  activeWallet: wallets.walletList[wallets.currentlySelected],
})

export const DeleteWallet = connect(mapStateToProps, { deleteWallet })(DeleteWalletPresentation)
