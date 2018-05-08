import { buildAction } from 'typesafe-actions'
import { Connection } from '@types'

export const loadConnections = buildAction('LOAD_CONNECTIONS').payload<Connection[]>()
