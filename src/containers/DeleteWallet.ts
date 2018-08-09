import { connect } from 'react-redux'

import { deleteWallet } from '@actions'
import { DeleteWallet as DeleteWalletPresentation } from '@components/DeleteWallet'
import { RootState } from '@store'

const mapStateToProps = ({ wallets: { activeWallet } }: RootState) => ({
  activeWallet,
})

export const DeleteWallet = connect(mapStateToProps, { deleteWallet })(DeleteWalletPresentation)
