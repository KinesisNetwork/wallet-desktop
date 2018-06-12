import { Connection } from '@types'

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
