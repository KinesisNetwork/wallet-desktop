import { Connection } from '@types'
import { buildAction } from 'typesafe-actions'

export const loadConnections = buildAction('LOAD_CONNECTIONS').payload<Connection[]>()
