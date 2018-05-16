import { changeView, selectWallet } from '@actions'
import { WalletList as WalletsPresentation } from '@components'
import { Dispatch, RootState } from '@store'
import { View } from '@types'
import { connect } from 'react-redux'

const mapStateToProps = ({wallets, view}: RootState) => ({
  currentWallet: view.currentView === View.dashboard ? wallets.currentlySelected : -1,
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
