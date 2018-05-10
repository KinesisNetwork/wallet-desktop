import { Network, Server, TransactionRecord } from 'js-kinesis-sdk'
import { flatten } from 'lodash'

import { Connection, TransactionOperationView } from '@types'
const STROOPS_IN_ONE_KINESIS = 10000000

export function getServer(connection: Connection): Server {
  Network.use(new Network(connection.networkPassphrase))
  return new Server(connection.horizonServer)
}

export async function getFeeInStroops(
  server: Server,
  amountInKinesis: number,
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

export async function getFeeInKinesis(
  connection: Connection,
  amountInKinesis: number,
): Promise<string> {
  const feeInStroops = await getFeeInStroops(getServer(connection), amountInKinesis)
  return String(Number(feeInStroops) / STROOPS_IN_ONE_KINESIS)
}

export async function getTransactions(
  connection: Connection,
  accountKey: string,
): Promise<TransactionOperationView[]> {
  const server = getServer(connection)
  const transactionPage = await server.transactions().forAccount(accountKey).order('desc').call()
  const nestedArray = await Promise.all(transactionPage.records.map(transactionWithOperations))
  return flatten(nestedArray)
}

async function transactionWithOperations(
  transaction: TransactionRecord,
): Promise<TransactionOperationView[]> {
  const operationsPage = await transaction.operations()
  return operationsPage.records.map((operation): TransactionOperationView => ({
    operation,
    date: new Date(transaction.created_at),
    fee: (Number(transaction.fee_paid) / STROOPS_IN_ONE_KINESIS).toFixed(5) ,
    memo: transaction.memo,
    source: transaction.source_account,
  }))
}
