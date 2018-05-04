import { connect } from 'react-redux'
import { RootState } from '@store'
import { changeView } from '@actions'
import { SidebarSettings as SidebarSettingsPresentation} from '@components'

const mapStateToProps = ({connections}: RootState) => ({
  connectionName: connections.currentConnection.connectionName,
})

export const SidebarSettings = connect(mapStateToProps, {changeView})(SidebarSettingsPresentation)
