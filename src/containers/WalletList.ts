import { changeView, selectWallet } from '@actions'
import { WalletList as WalletsPresentation } from '@components'
import { Dispatch, RootState } from '@store'
import { View } from '@types'
import { connect } from 'react-redux'

const mapStateToProps = ({wallets}: RootState) => ({
  currentWallet: wallets.currentlySelected,
  wallets: wallets.walletList,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addWallet: () => dispatch(changeView(View.create)),
  selectWallet: (walletIndex: number) => {
    dispatch(selectWallet(walletIndex))
    dispatch(changeView(View.dashboard))
  },
})

export const WalletList = connect(mapStateToProps, mapDispatchToProps)(WalletsPresentation)
