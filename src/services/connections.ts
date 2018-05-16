import { addNewItem, retrieveItems, saveItems } from '@services/persistance'
import { Connection } from '@types'
const CONNECTION_KEY = 'connection'

export const DEFAULT_CONNECTIONS: Connection[] = [
  {
    name: 'Local Development Network',
    horizonURL: 'https://stellar-local.abx.com',
    networkPassphrase: 'Test SDF Network ; September 2015',
  },
  {
    name: 'Kinesis UAT Network',
    horizonURL: 'https://kinesis-uat.abx.com',
    networkPassphrase: 'Kinesis UAT',
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
    (conn) => !DEFAULT_CONNECTIONS.find(({horizonURL}) => horizonURL === conn.horizonURL),
  )
  return saveItems<Connection>(CONNECTION_KEY, savedConnections)
}
