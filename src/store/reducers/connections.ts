import { combineReducers } from 'redux'
import { Connection } from '@types'
import { RootAction } from '@store'
import { DEFAULT_CONNECTIONS } from '@services/connections'

export interface ConnectionsState {
  connectionList: Connection[]
  currentConnection: Connection
}

export const connections = combineReducers<ConnectionsState, RootAction>({
  connectionList: (state = DEFAULT_CONNECTIONS) => state,
  currentConnection: (state = DEFAULT_CONNECTIONS[0]) => state,
})
