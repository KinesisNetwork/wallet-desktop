import { CollectionPage, Keypair, Network, Server, TransactionRecord } from 'js-kinesis-sdk'
import { flatten, get } from 'lodash'

import { Connection, TransactionLoader, TransactionOperationView } from '@types'
const STROOPS_IN_ONE_KINESIS = 10000000
export const BASE_NETWORK_FEE = 100e-7

export enum OperationErrors {
  op_low_reserve = 'Transfer amount is lower than the base reserve',
  op_already_exist = 'The account already exists.',
  op_no_destination = 'The target payment account does not exist.',
  op_bad_auth = 'Invalid transaction signature',
}

export enum TransactionErrors {
  tx_insufficient_fee = 'The fee on the transaction was too low',
  tx_insufficient_balance = 'Insufficient account balance',
  tx_bad_auth = 'Invalid transaction signature',
  tx_bad_auth_extra = 'Too many signatures provided',
  tx_bad_seq = 'Invalid account sequence',
}

export function transactionErrorCodeToMessage(txError: string, opError: string) {
  return (
    OperationErrors[opError] ||
    TransactionErrors[txError] ||
    'An error occurred with the transaction'
  )
}

export function getTransactionErrorMessage(failedTxPayload: any) {
  const txErrorCode = get(failedTxPayload, 'data.extras.result_codes.transaction')
  const opErrorCode = get(failedTxPayload, 'data.extras.result_codes.operations[0]')
  return transactionErrorCodeToMessage(txErrorCode, opErrorCode)
}

export function getServer(connection: Connection): Server {
  Network.use(new Network(connection.passphrase))
  return new Server(connection.endpoint)
}

export async function getFeeInStroops(server: Server, amountInKinesis: number): Promise<string> {
  const mostRecentLedger = await server
    .ledgers()
    .order('desc')
    .call()
  const {
    base_percentage_fee: basePercentageFee,
    base_fee_in_stroops: baseFeeInStroops,
    max_fee: maxFeeInStroops,
  } = mostRecentLedger.records[0]
  const basisPointsToPercent = 10000

  const percentageFee =
    ((Number(amountInKinesis) * basePercentageFee) / basisPointsToPercent) * STROOPS_IN_ONE_KINESIS

  return String(Math.min(Math.ceil(percentageFee + baseFeeInStroops), maxFeeInStroops))
}

export async function getFeeInKinesis(
  connection: Connection,
  amountInKinesis: number,
): Promise<string> {
  const feeInStroops = await getFeeInStroops(getServer(connection), amountInKinesis).catch(_ => '0')
  return String(Number(feeInStroops) / STROOPS_IN_ONE_KINESIS)
}

export async function getTransactions(
  connection: Connection,
  accountKey: string,
): Promise<TransactionLoader> {
  const server = getServer(connection)
  try {
    const transactionPage = await server
      .transactions()
      .forAccount(accountKey)
      .order('desc')
      .call()
    const nestedArray = await Promise.all(getNestedArray(transactionPage, accountKey))
    return { operations: flatten(nestedArray), transactionPage }
  } catch (e) {
    return { operations: [], transactionPage: null }
  }
}

export async function getNextTransactionPage(
  currentPage: CollectionPage<TransactionRecord> | null,
  accountKey: string,
): Promise<TransactionLoader> {
  try {
    if (!currentPage) {
      throw new Error()
    }

    const nextPage = await currentPage.next()
    const nestedArray = await Promise.all(getNestedArray(nextPage, accountKey))
    return { operations: flatten(nestedArray), transactionPage: nextPage }
  } catch (e) {
    return { operations: [], transactionPage: null }
  }
}

function getNestedArray(transactionPage: CollectionPage<TransactionRecord>, accountKey: string) {
  return transactionPage.records.map(t => transactionWithOperations(t, accountKey))
}

async function transactionWithOperations(
  transaction: TransactionRecord,
  accountKey: string,
): Promise<TransactionOperationView[]> {
  const operationsPage = await transaction.operations()
  return operationsPage.records.map(
    (operation): TransactionOperationView => ({
      operation,
      date: new Date(transaction.created_at),
      fee: (Number(transaction.fee_paid) / STROOPS_IN_ONE_KINESIS).toFixed(5),
      isIncoming: transaction.source_account !== accountKey,
      memo: transaction.memo,
      source: transaction.source_account,
      id: transaction.id,
    }),
  )
}

export function isValidSecret(secret: string) {
  try {
    Keypair.fromSecret(secret)
    return true
  } catch (e) {
    return false
  }
}

export function isValidPublicKey(publicKey: string) {
  try {
    Keypair.fromPublicKey(publicKey)
    return true
  } catch (e) {
    return false
  }
}
