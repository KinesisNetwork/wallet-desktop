import { connect } from 'react-redux'

import { addConnection, handleConnectionFormChange } from '@actions'
import { ConnectionForm as ConnectionFormPresentation } from '@components/ConnectionForm'
import { RootState } from '@store'

export const mapStateToProps = ({connections}: RootState) => connections.form

const mapDispatchToProps = {
  addConnection,
  handleConnectionFormChange,
}

export const ConnectionForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectionFormPresentation)
