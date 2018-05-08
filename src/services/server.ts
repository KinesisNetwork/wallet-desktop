import { Connection } from '@types';
import { Server, Network } from 'js-kinesis-sdk';

export function getServer (connection: Connection): Server {
  Network.use(new Network(connection.networkPassphrase))
  return new Server(connection.horizonServer)
}
