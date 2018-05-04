import { Connection } from '@interfaces'
import { addNewItem, retrieveItems, saveItems } from './persistance';
const CONNECTION_KEY = 'connection'

export const DEFAULT_CONNECTIONS: Connection[] = [
  {
    horizonServer: 'https://stellar-local.abx.com',
    networkPassphrase: 'Test SDF Network ; September 2015',
    connectionName: 'Local Development Network'
  },
  {
    horizonServer: 'https://kinesis-uat.abx.com',
    networkPassphrase: 'Kinesis UAT',
    connectionName: 'Kinesis UAT Network'
  },
]

export function addNewConnection(connection: Connection) {
  return addNewItem(CONNECTION_KEY, connection)
}

export async function retrieveConnections() {
  return DEFAULT_CONNECTIONS.concat(await retrieveItems<Connection>(CONNECTION_KEY))
}

export function saveConnections(connections: Connection[]) {
  // don't persist default connections
  const savedConnections = connections.filter(
    (conn) => DEFAULT_CONNECTIONS.find(({horizonServer}) => horizonServer === conn.horizonServer)
  )
  return saveItems<Connection>(CONNECTION_KEY, savedConnections)
}
