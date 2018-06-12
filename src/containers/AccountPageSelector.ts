import { connect } from 'react-redux'

import { setAccountPage } from '@actions'
import { AccountPageSelector as AccountPagePresentation } from '@components'
import { RootState } from '@store'

const mapStateToProps = ({accountPage}: RootState) => ({
  accountPage: accountPage.accountPage,
})

const mapDispatchToProps = {
  setAccountPage,
}

export const AccountPageSelector = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountPagePresentation)
