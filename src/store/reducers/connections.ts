import { DEFAULT_CONNECTIONS } from '@services/connections'
import { RootAction } from '@store'
import { Connection } from '@types'
import { combineReducers } from 'redux'

export interface ConnectionsState {
  connectionList: Connection[]
  currentConnection: Connection
}

export const connections = combineReducers<ConnectionsState, RootAction>({
  connectionList: (state = DEFAULT_CONNECTIONS) => state,
  currentConnection: (state = DEFAULT_CONNECTIONS[0]) => state,
})
