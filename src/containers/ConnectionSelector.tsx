import * as React from 'react'
import { connect } from 'react-redux'

import { EditableText } from '@components/EditableText'

import {
  handleConnectionFormChange,
  selectConnectedCurrency,
  selectConnectedStage,
  selectForEditConnection,
  selectUpdatingCurrency,
  stopEditingConnection,
} from '@actions'
import { getCurrentConnectionForEditing } from '@selectors'
import { RootState } from '@store'
import { ConnectionStage, Currency } from '@types'

export const mapStateToProps = ({ connections }: RootState) => ({
  isEditing: connections.updating.isEditing,
  connectionToEdit: getCurrentConnectionForEditing(connections),
  currentCurrency: connections.updating.selectedCurrency,
  currentStage: connections.currentStage,
})

const mapDispatchToProps = {
  selectConnectedStage,
  selectConnectedCurrency,
  selectForEditConnection,
  handleConnectionFormChange,
  stopEditingConnection,
  selectUpdatingCurrency,
}

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>

const ConnectionSelectorComponent: React.SFC<Props> = props => (
  <nav className="panel">
    <div className="panel-heading">
      <div className="field is-grouped is-horizontal">
        <div className="field-label is-normal">
          <label>Network</label>
        </div>
        <div className="field-body">
          <div className="field has-addons has-addons-right">
            <div className="control">
              <button
                className={[
                  'button',
                  ...(props.currentStage === ConnectionStage.mainnet
                    ? ['is-active', 'is-success']
                    : []),
                ].join(' ')}
                onClick={() => props.selectConnectedStage(ConnectionStage.mainnet)}
              >
                Main
              </button>
            </div>
            <div className="control">
              <button
                className={[
                  'button',
                  ...(props.currentStage === ConnectionStage.testnet
                    ? ['is-active', 'is-success']
                    : []),
                ].join(' ')}
                onClick={() => props.selectConnectedStage(ConnectionStage.testnet)}
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="panel-tabs">
      <a
        className={props.currentCurrency === Currency.KAU ? 'is-active' : ''}
        onClick={() => props.selectUpdatingCurrency(Currency.KAU)}
      >
        {Currency.KAU}
      </a>
      <a
        className={props.currentCurrency === Currency.KAG ? 'is-active' : ''}
        onClick={() => props.selectUpdatingCurrency(Currency.KAG)}
      >
        {Currency.KAG}
      </a>
      <a
        className={props.currentCurrency === Currency.KEM ? 'is-active' : ''}
        onClick={() => props.selectUpdatingCurrency(Currency.KEM)}
      >
        {Currency.KEM}
      </a>
    </div>
    <div className="panel-block is-block">
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Endpoint</label>
        </div>
        <div className="field-body">
          <div className="field">
            <EditableText
              isEditing={props.isEditing === 'endpoint'}
              value={props.connectionToEdit.endpoint}
              onChangeHandler={ev =>
                props.handleConnectionFormChange({
                  field: 'endpoint',
                  newValue: ev.currentTarget.value,
                  currentCurrency: props.currentCurrency,
                  currentStage: props.currentStage,
                })
              }
              onStartEditing={() => props.selectForEditConnection('endpoint')}
              onStopEditing={() => props.stopEditingConnection()}
            />
          </div>
        </div>
      </div>
    </div>
    <div className="panel-block is-block">
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Passphrase</label>
        </div>
        <div className="field-body">
          <div className="field">
            <EditableText
              isEditing={props.isEditing === 'passphrase'}
              value={props.connectionToEdit.passphrase}
              onChangeHandler={ev =>
                props.handleConnectionFormChange({
                  field: 'passphrase',
                  newValue: ev.currentTarget.value,
                  currentCurrency: props.currentCurrency,
                  currentStage: props.currentStage,
                })
              }
              onStartEditing={() => props.selectForEditConnection('passphrase')}
              onStopEditing={() => props.stopEditingConnection()}
            />
          </div>
        </div>
      </div>
    </div>
  </nav>
)

export const ConnectionSelector = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectionSelectorComponent)
