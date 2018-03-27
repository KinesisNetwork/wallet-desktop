import { Connection } from '../app';
import * as _ from 'lodash';
import { addNewItem, retrieveItems, saveItems } from './persistance';
const connectionKey = 'connection'

export let defaultConnections: Connection[] = [{
  horizonServer: 'https://stellar-local.abx.com',
  networkPassphrase: 'Test SDF Network ; September 2015',
  connectionName: 'Local Development Network'
}, {
  horizonServer: 'https://kinesis-test-net.abx.com',
  networkPassphrase: 'Kinesis Test Network ; February 2018',
  connectionName: 'Kinesis Test Network'
}, {
  horizonServer: 'https://horizon-testnet.stellar.org/',
  networkPassphrase: 'Test SDF Network ; September 2015',
  connectionName: 'Stellar Test Network'
}]

export function addNewConnection(connection: Connection) {
  return addNewItem<Connection>(connectionKey, connection)
}

export async function retrieveConnections() {
  return defaultConnections.concat(await retrieveItems<Connection>(connectionKey))
}

export function saveConnections(connections: Connection[]) {
  // don't persist default connections
  let savedConnections = _.filter(connections, (con) => !_.includes(defaultConnections, con))
  return saveItems<Connection>(connectionKey, savedConnections)
}

