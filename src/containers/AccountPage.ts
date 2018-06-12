import { AccountPage as AccountPagePresentation } from '@components'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({accountPage}: RootState) => ({
  accountPage: accountPage.accountPage,
})

export const AccountPage = connect(mapStateToProps)(AccountPagePresentation)
