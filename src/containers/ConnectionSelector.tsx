import * as React from 'react'
import { connect } from 'react-redux'

import { selectConnection } from '@actions'
import { RootState } from '@store'
import { Currency } from '@types'

export const mapStateToProps = ({ connections }: RootState) => ({
  connections: connections.connectionList,
  activeConnection: connections.connectionList.findIndex(
    conn => conn.horizonURL === connections.currentConnection.horizonURL,
  ),
})

const mapDispatchToProps = {
  selectConnection,
}

const ConnectionSelectorComponent: React.SFC = () => (
  <nav className="panel">
    <div className="panel-heading">
      <div className="field is-grouped is-horizontal">
        <div className="field-label is-normal">
          <label>Network</label>
        </div>
        <div className="field-body">
          <div className="field has-addons has-addons-right">
            <div className="control">
              <button className="button is-success is-selected">Main</button>
            </div>
            <div className="control">
              <button className="button">Test</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="panel-tabs">
      <a className="is-active">{Currency.KAU}</a>
      <a>{Currency.KAG}</a>
    </div>
    <div className="panel-block">
      <div className="control has-icons-left">
        <input className="input" placeholder="add new endpoint" />
        <span className="icon is-left">
          <i className="fas fa-plus" />
        </span>
      </div>
    </div>
  </nav>
)

export const ConnectionSelector = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectionSelectorComponent)
