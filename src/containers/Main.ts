import { Main as MainPresentation } from '@components'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({ view }: RootState) => ({
  currentView: view.currentView,
})

export const Main = connect(mapStateToProps)(MainPresentation)
