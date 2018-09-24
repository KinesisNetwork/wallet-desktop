import { Connection } from '@types'

export async function fetchConnections(): Promise<Connection[]> {
  const response = await fetch(
    'https://s3-ap-southeast-2.amazonaws.com/kinesis-config/kinesis-server-details.json',
  )
  const connections: Connection[] = await response.json()
  return connections
}
