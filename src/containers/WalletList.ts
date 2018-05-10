import { changeView, selectWallet } from '@actions'
import { WalletList as WalletsPresentation } from '@components'
import { Dispatch, RootState } from '@store'
import { View } from '@types'
import { connect } from 'react-redux'

const mapStateToProps = ({wallets}: RootState) => ({
  wallets: wallets.walletList,
  currentWallet: wallets.currentlySelected,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  selectWallet: (walletIndex: number) => {
    dispatch(selectWallet(walletIndex))
    dispatch(changeView(View.dashboard))
  },
  addWallet: () => dispatch(changeView(View.create)),
})

export const WalletList = connect(mapStateToProps, mapDispatchToProps)(WalletsPresentation)
