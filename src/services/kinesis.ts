import { CollectionPage, Keypair, Network, Server, TransactionRecord } from 'js-kinesis-sdk'
import { flatten, get } from 'lodash'

import { Connection, TransactionLoader, TransactionOperationView, WalletAccount } from '@types'
const STROOPS_IN_ONE_KINESIS = 10_000_000

export function convertStroopsToKinesis(numberInStroops: number) {
  return numberInStroops / STROOPS_IN_ONE_KINESIS
}

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

export async function getFeeInStroops(
  server: Server,
  amountInKinesis: number,
  source: string,
  passphrase: string,
): Promise<string> {
  let isWhitelisted = false
  const mnetWhiteListedAccount = [
    'GA6BP5AHBADCCHIE7FCIARHH64IQZIZMNKCQWPIMROMYIPWYO7VTUDMQ',
    'GAFUJGZWMGWVZJ4PUVHQM54GDBPN7Q5FJQ7GEQ35AW5QPSRX74UHTPXS',
    'GBIHU73FWFDKGZY2XIHZNPO4RBAIHEV433C55XIHC34IYLUGPRY2G4P5',
    'GD5CMVRI42SUHBRWHX4EPXYGPBJTYU4XB36XSNPMRHYEFBP2WS5LFQAO',
    'GAKQ4BXFLMB5LQ6IQZXMU4PRHPAQH6MLZNLOH2DUYE7X3TRQYUK2QFYW',
  ]
  const tnetWhiteListedAccount = [
    'GC5Z3MPAZFZGGCGSACYTXQO4RFMNKBEDPULU5XD6ZVRRCWA5C3NVJ3VP',
    'GBAVVI7NQXNH4PVNWZJCIJPF4C7PPFSMLWB4UZEZDQZQYX52E56AYV35',
    'GDHCV4C5P2ZCHDFKOHNMAWBK2BPMOJCXQK4QZ74NU2JCPSJRHTZ2SDAN',
    'GAPZHHMWDW3X6PPKUVB4MQHC5HVZLAAPIL27E3R3NISK7ITINHENAXHO',
    'GACMG3VV2XINSQYR2DZ2HRWCQBL274UHTNCDKT5R7XWUOELQM2CHUVM6',
  ]
  isWhitelisted =
    (passphrase === 'KEM LIVE' && mnetWhiteListedAccount.includes(source)) ||
    (passphrase === 'KEM UAT' && tnetWhiteListedAccount.includes(source))
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

  const percentageFee = isWhitelisted
    ? 0
    : ((Number(amountInKinesis) * (basePercentageFee || 45)) / basisPointsToPercent) *
      STROOPS_IN_ONE_KINESIS

  return String(
    Math.min(Math.ceil(percentageFee + baseFeeInStroops), maxFeeInStroops || 250000000000),
  )
}

export async function getFeeInKinesis(
  connection: Connection,
  amountInKinesis: number,
  account: string,
): Promise<string> {
  const feeInStroops = await getFeeInStroops(
    getServer(connection),
    amountInKinesis,
    account,
    connection.passphrase,
  ).catch(_ => '0')
  return String(Number(feeInStroops) / STROOPS_IN_ONE_KINESIS)
}

/**
 * Minimum Balance
 *
 * The minimum account balance is calculated by entries for the account.
 * Each entry costs 1 * base_reserve.
 * The minimum balance is 2 * base_reserve for a standard account.
 *
 * Each additional signer increases this entry count by 1.
 *
 * @example
 * A standard account (with default signer) has a minimum balance of 2 * base_reserve = 0.02 KAU
 * An account (with default signer) plus 1 extra signer has a minimum balance of (2 + 1) * base_reserve = 0.03 KAU
 *
 * There are other Stellar entries which will increase this count but are unlikely
 * to occur on our network (eg offers, trustlines).
 *
 * @link https://www.stellar.org/developers/guides/concepts/fees.html for more info
 */
export async function getMinBalanceInKinesis(
  connection: Connection,
  account: WalletAccount,
): Promise<number> {
  const server = getServer(connection)
  const ledgerFetch = server
    .ledgers()
    .order('desc')
    .limit(1)
    .call()
  const accountFetch = server.loadAccount(account.keypair.publicKey())

  const [
    {
      records: [latestLedger],
    },
    { signers },
  ] = await Promise.all([ledgerFetch, accountFetch])

  const { base_reserve_in_stroops: baseReserveInStroops } = latestLedger
  let baseReserveInKinesis = baseReserveInStroops / STROOPS_IN_ONE_KINESIS

  baseReserveInKinesis =
    connection.passphrase === 'KEM UAT' || connection.passphrase === 'KEM LIVE'
      ? 0.0000001
      : baseReserveInKinesis

  const extraSignerEntries = signers.length - 1

  const standardAccountEntries = 2

  const totalAccountEntries = standardAccountEntries + extraSignerEntries

  const minBalance = baseReserveInKinesis * totalAccountEntries

  return minBalance
}

export async function getBaseReserveInKinesis(connection: Connection) {
  const server = getServer(connection)
  const mostRecentLedger = await server
    .ledgers()
    .order('desc')
    .call()
  const { base_reserve_in_stroops: baseReserveInStroops } = mostRecentLedger.records[0]
  return connection.passphrase === 'KEM UAT' || connection.passphrase === 'KEM LIVE'
    ? 0.0000001
    : Number(baseReserveInStroops) / STROOPS_IN_ONE_KINESIS
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
  const feeCharged = await fetch(operationsPage.records[0]._links.transaction.href)
    .then(res => res.json())
    .then(val => val.fee_charged)
  return operationsPage.records.map(
    (operation): TransactionOperationView => ({
      operation,
      date: new Date(transaction.created_at),
      fee: transaction.fee_paid
        ? (Number(transaction.fee_paid) / STROOPS_IN_ONE_KINESIS).toFixed(5)
        : (Number(feeCharged) / 10000000).toFixed(7),
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
