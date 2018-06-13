import { deleteWallet } from '@actions'
import { DeleteWallet as DeleteWalletPresentation } from '@components'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({ wallets }: RootState) => ({
  activeWallet: wallets.selectedWallet,
})

export const DeleteWallet = connect(mapStateToProps, { deleteWallet })(DeleteWalletPresentation)
