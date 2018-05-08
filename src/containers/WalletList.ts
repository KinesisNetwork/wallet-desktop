import { connect } from 'react-redux'
import { Dispatch, RootState } from '@store'
import { changeView, selectWallet } from '@actions'
import { WalletList as WalletsPresentation } from '@components'
import { View } from '@types';

const mapStateToProps = ({wallets}: RootState) => ({
  wallets: wallets.walletList,
  currentWallet: wallets.currentlySelected,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  selectWallet: (walletIndex: number) => {
    dispatch(selectWallet(walletIndex))
    dispatch(changeView(View.dashboard))
  },
  addWallet: () => dispatch(changeView(View.create))
})

export const WalletList = connect(mapStateToProps, mapDispatchToProps)(WalletsPresentation)
