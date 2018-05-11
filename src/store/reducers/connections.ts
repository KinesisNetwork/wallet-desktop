import { addConnection, handleConnectionFormChange, loadConnections, selectConnection } from '@actions'
import { DEFAULT_CONNECTIONS } from '@services/connections'
import { RootAction } from '@store'
import { Connection } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface ConnectionsState {
  connectionList: Connection[]
  currentConnection: Connection
  form: Connection
}

const handleChange = (name: keyof Connection) => (state = '', action: RootAction) => {
  switch (action.type) {
    case getType(handleConnectionFormChange):
      return action.payload.field === name ? action.payload.newValue : state
    case getType(addConnection): return ''
    default: return state
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
      case getType(loadConnections): return action.payload
      case getType(addConnection): return [...state, action.payload]
      default: return state
    }
  },
  currentConnection: (state = DEFAULT_CONNECTIONS[0], action) => {
    switch (action.type) {
      case getType(selectConnection): return action.payload
      default: return state
    }
  },
})
