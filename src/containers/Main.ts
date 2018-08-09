import { connect } from 'react-redux'

import { Main as MainPresentation } from '@components/Main'
import { RootState } from '@store'

const mapStateToProps = ({ view }: RootState) => ({
  activeView: view.walletView,
})

export const Main = connect(mapStateToProps)(MainPresentation)
