import { Network, Server, TransactionRecord } from 'js-kinesis-sdk'
import { flatten, get } from 'lodash'

import { Connection, TransactionOperationView } from '@types'
const STROOPS_IN_ONE_KINESIS = 10000000

export const operationErrorCodeToMessage = {
  op_low_reserve: 'Transfer amount is lower than the base reserve',
  op_already_exist: 'The account already exists.',
  op_no_destination: 'The target payment account does not exist.',
  unknown_error: 'An error occured with the transaction.',
}

export function transactionErrorCodeToMessage(txError: string, opError: string) {
  const errorToMessage = {
    tx_insufficient_fee: 'The fee on the transaction was too low',
    tx_insufficient_balance: 'Insufficient account balance',
    tx_bad_auth: 'Invalid transaction signature',
    tx_bad_auth_extra: 'Too many signatures provided',
    tx_bad_seq: 'Invalid account sequence',
    tx_failed: operationErrorCodeToMessage[opError],
    unknown_error: 'An error occured with the transaction.',
  }

  return errorToMessage[txError]
}

export function getTransactionErrorMessage(failedTxPayload: any) {
  const txErrorCode = get(failedTxPayload, 'data.extras.result_codes.transaction', 'unknown_error')
  const opErrorCode = get(failedTxPayload, 'data.extras.result_codes.operations[0]', 'unknown_error')
  return transactionErrorCodeToMessage(txErrorCode, opErrorCode)
}

export function getServer(connection: Connection): Server {
  Network.use(new Network(connection.networkPassphrase))
  return new Server(connection.horizonURL)
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
  try {
    const transactionPage = await server.transactions().forAccount(accountKey).order('desc').call()
    const nestedArray = await Promise.all(transactionPage.records.map((t) => transactionWithOperations(t, accountKey)))
    return flatten(nestedArray)
  } catch (e) {
    return []
  }
}

async function transactionWithOperations(
  transaction: TransactionRecord,
  accountKey: string,
): Promise<TransactionOperationView[]> {
  const operationsPage = await transaction.operations()
  return operationsPage.records.map((operation): TransactionOperationView => ({
    operation,
    date: new Date(transaction.created_at),
    fee: (Number(transaction.fee_paid) / STROOPS_IN_ONE_KINESIS).toFixed(5) ,
    isIncoming: transaction.source_account === accountKey,
    memo: transaction.memo,
    source: transaction.source_account,
  }))
}
