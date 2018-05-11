import { addConnection, selectConnection } from '@actions'
import { DEFAULT_CONNECTIONS } from '@services/connections'
import { RootAction } from '@store'
import { Connection } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface ConnectionsState {
  connectionList: Connection[]
  currentConnection: Connection
}

export const connections = combineReducers<ConnectionsState, RootAction>({
  connectionList: (state = DEFAULT_CONNECTIONS, action) => {
    switch (action.type) {
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
