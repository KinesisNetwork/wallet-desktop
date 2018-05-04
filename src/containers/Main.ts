import { connect } from 'react-redux'
import { Dispatch, RootState } from '@store'
import { loadWallets, loadConnections } from '@actions'
import { retrieveWallets } from '@services/wallets'
import { retrieveConnections } from '@services/connections'
import { Main as MainPresentation } from '@components'

const mapStateToProps = ({view}: RootState) => ({
  currentView: view.currentView,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadWallets: async () => {
    const wallets = await retrieveWallets()
    dispatch(loadWallets(wallets))
  },
  loadConnections: async () => {
    const connections = await retrieveConnections()
    dispatch(loadConnections(connections))
  },
})

export const Main = connect(mapStateToProps, mapDispatchToProps)(MainPresentation)
