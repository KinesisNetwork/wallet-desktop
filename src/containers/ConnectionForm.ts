import { connect } from 'react-redux'

import { addConnection, handleConnectionFormChange } from '@actions'
import { ConnectionForm as ConnectionFormPresentation } from '@components'
import { RootState } from '@store'

const mapStateToProps = ({connections}: RootState) => ({
  ...connections.form,
})

const mapDispatchToProps = {
  addConnection,
  handleConnectionFormChange,
}

export const ConnectionForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectionFormPresentation)
