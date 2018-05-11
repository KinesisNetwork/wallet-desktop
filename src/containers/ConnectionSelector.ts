import { selectConnection } from '@actions'
import { ConnectionSelector as ConnectionSelectorPresentation } from '@components'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({connections}: RootState) => ({
  connections: connections.connectionList,
  currentlySelected: connections.connectionList.findIndex(
    (conn) => conn.horizonServer === connections.currentConnection.horizonServer,
  ),
})

const mapDispatchToProps = {
  selectConnection,
}

export const ConnectionSelector = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectionSelectorPresentation)
