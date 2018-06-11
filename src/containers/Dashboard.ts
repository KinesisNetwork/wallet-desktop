import { Dashboard as DashboardPresentation } from '@components'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({accountPage}: RootState) => ({
  accountPage: accountPage.accountPage,
})

export const Dashboard = connect(mapStateToProps)(DashboardPresentation)
