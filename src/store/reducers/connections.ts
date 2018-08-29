import {
  addConnection,
  handleConnectionFormChange,
  loadConnectionsSuccess,
  selectConnection,
} from '@actions'
import { RootAction } from '@store'
import { Connection } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

const DEFAULT_CONNECTIONS: Connection[] = [
  {
    horizonURL: 'https://kau-testnet.kinesisgroup.io',
    name: 'KAU Testnet',
    networkPassphrase: 'Kinesis UAT',
  },
]

export interface ConnectionsState {
  connectionList: Connection[]
  currentConnection: Connection
  form: Connection
}

const handleChange = (name: keyof Connection) => (state = '', action: RootAction) => {
  switch (action.type) {
    case getType(handleConnectionFormChange):
      return action.payload.field === name ? action.payload.newValue : state
    case getType(addConnection):
      return ''
    default:
      return state
  }
}

const form = combineReducers<Connection, RootAction>({
  horizonURL: handleChange('horizonURL'),
  name: handleChange('name'),
  networkPassphrase: handleChange('networkPassphrase'),
})

export const connections = combineReducers<ConnectionsState, RootAction>({
  form,
  connectionList: (state = DEFAULT_CONNECTIONS, action) => {
    switch (action.type) {
      case getType(loadConnectionsSuccess):
        return [
          ...state,
          ...action.payload.filter(
            conn => !state.find(existing => existing.horizonURL === conn.horizonURL),
          ),
        ]
      case getType(addConnection):
        return [...state, action.payload]
      default:
        return state
    }
  },
  currentConnection: (state = DEFAULT_CONNECTIONS[0], action) => {
    switch (action.type) {
      case getType(selectConnection):
        return action.payload
      default:
        return state
    }
  },
})
