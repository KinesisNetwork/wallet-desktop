import { connect } from 'react-redux'
import { RootState } from '@store'
import { changeView } from '@actions'
import { WalletList as WalletsPresentation } from '@components'

const mapStateToProps = ({wallets}: RootState) => ({
  wallets: wallets.walletList,
  currentWallet: wallets.currentlySelected,
})

export const WalletList = connect(mapStateToProps, { changeView })(WalletsPresentation)
