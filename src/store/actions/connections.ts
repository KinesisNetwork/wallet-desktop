import { buildAction } from 'typesafe-actions'
import { Connection } from '@types'

export const loadConnections = buildAction('LOAD_CONNECTIONS').payload<Connection[]>()
export const addConnection = buildAction('ADD_CONNECTION').async<Connection, Connection[], Error>()
