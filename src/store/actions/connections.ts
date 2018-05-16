import { Connection, FormUpdate } from '@types'
import { buildAction } from 'typesafe-actions'

export const loadConnections = buildAction('LOAD_CONNECTIONS').payload<Connection[]>()
export const addConnection = buildAction('ADD_CONNECTION').payload<Connection>()
export const selectConnection = buildAction('SELECT_CONNECTION').payload<Connection>()
export const handleConnectionFormChange = buildAction('UPDATE_CONNECTION_FORM').payload<FormUpdate<Connection>>()
