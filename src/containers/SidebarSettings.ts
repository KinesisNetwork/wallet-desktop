import { connect } from 'react-redux'

import { SidebarSettings as SidebarSettingsPresentation } from '@components/SidebarSettings'
import { RootState } from '@store'
import { withRouter } from 'react-router'

const mapStateToProps = ({ connections }: RootState) => ({
  connectionName: connections.currentStage as string,
})

export const SidebarSettings = withRouter(connect(mapStateToProps)(SidebarSettingsPresentation))
