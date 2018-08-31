import { connect } from 'react-redux'

import { changeWalletView } from '@actions'
import { SidebarSettings as SidebarSettingsPresentation } from '@components/SidebarSettings'
import { RootState } from '@store'

const mapStateToProps = ({ connections }: RootState) => ({
  connectionName: connections.currentStage as string,
})

export const SidebarSettings = connect(
  mapStateToProps,
  { changeWalletView },
)(SidebarSettingsPresentation)
