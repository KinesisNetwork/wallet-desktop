import { deleteWallet } from '@actions'
import { DeleteWallet as DeleteWalletPresentation } from '@components'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({ wallets: { activeWallet } }: RootState) => ({
  activeWallet,
})

export const DeleteWallet = connect(mapStateToProps, { deleteWallet })(DeleteWalletPresentation)
