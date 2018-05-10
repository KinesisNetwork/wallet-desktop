import { Connection } from '@types'
import { Network, Server } from 'js-kinesis-sdk'
const STROOPS_IN_ONE_KINESIS = 10000000

export function getServer(connection: Connection): Server {
  Network.use(new Network(connection.networkPassphrase))
  return new Server(connection.horizonServer)
}

export async function getFeeInStroops(
  server: Server,
  amountInKinesis: string,
): Promise<string> {
  const mostRecentLedger = await server.ledgers().order('desc').call()
  const {
    base_percentage_fee: basePercentageFee,
    base_fee_in_stroops: baseFeeInStroops,
  } = mostRecentLedger.records[0]
  const basisPointsToPercent = 10000

  const percentageFee = Number(amountInKinesis) * basePercentageFee / basisPointsToPercent * STROOPS_IN_ONE_KINESIS

  return String(percentageFee + baseFeeInStroops)
}
