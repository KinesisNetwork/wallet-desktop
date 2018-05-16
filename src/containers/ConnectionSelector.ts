import { selectConnection } from '@actions'
import { ConnectionSelector as ConnectionSelectorPresentation } from '@components'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = ({connections}: RootState) => ({
  connections: connections.connectionList,
  currentlySelected: connections.connectionList.findIndex(
    (conn) => conn.horizonURL === connections.currentConnection.horizonURL,
  ),
})

const mapDispatchToProps = {
  selectConnection,
}

export const ConnectionSelector = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectionSelectorPresentation)
