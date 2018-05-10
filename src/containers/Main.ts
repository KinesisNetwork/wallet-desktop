import { loadConnections, loadWallets } from '@actions'
import { Main as MainPresentation } from '@components'
import { retrieveConnections } from '@services/connections'
import { retrieveWallets } from '@services/wallets'
import { Dispatch, RootState } from '@store'
import { connect } from 'react-redux'

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
