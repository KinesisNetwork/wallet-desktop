import { connect } from 'react-redux'

import { setAccountPage } from '@actions'
import { AccountPageSelector as AccountPagePresentation } from '@components/AccountPageSelector'
import { RootState } from '@store'

export const mapStateToProps = ({accountPage}: RootState) => accountPage

const mapDispatchToProps = {
  setAccountPage,
}

export const AccountPageSelector = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountPagePresentation)
