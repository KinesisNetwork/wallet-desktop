import { connect } from 'react-redux'

import { AccountPage as AccountPagePresentation } from '@components/AccountPage'
import { RootState } from '@store'

export const mapStateToProps = ({accountPage}: RootState) => ({
  accountPage: accountPage.accountPage,
})

export const AccountPage = connect(mapStateToProps)(AccountPagePresentation)
