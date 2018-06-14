import { Main as MainPresentation } from '@components'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({ view }: RootState) => ({
  activeView: view.walletView,
})

export const Main = connect(mapStateToProps)(MainPresentation)
