import { connect } from 'react-redux'

import { selectConnection } from '@actions'
import { ConnectionSelector as ConnectionSelectorPresentation } from '@components/ConnectionSelector'
import { RootState } from '@store'

export const mapStateToProps = ({ connections }: RootState) => ({
  connections: connections.connectionList,
  activeConnection: connections.connectionList.findIndex(
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
