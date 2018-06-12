import { changeWalletView } from '@actions'
import { SidebarSettings as SidebarSettingsPresentation } from '@components'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({ connections }: RootState) => ({
  connectionName: connections.currentConnection.name,
})

export const SidebarSettings = connect(mapStateToProps, { changeWalletView })(SidebarSettingsPresentation)
