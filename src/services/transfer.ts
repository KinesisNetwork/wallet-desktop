import {
  Account,
  Asset,
  Keypair,
  Memo,
  Operation,
  Server,
  Transaction,
  TransactionBuilder,
} from 'js-kinesis-sdk'

import { WalletLockError } from '@helpers/errors'
import { Connection, TransferRequest } from '@types'
import { getAccountIfExists } from './accounts'
import { getFeeInStroops, getServer } from './kinesis'

export async function createKinesisTransfer(
  decryptedPrivateKey: string,
  connection: Connection,
  request: TransferRequest,
): Promise<Transaction> {
  if (!decryptedPrivateKey) {
    throw new WalletLockError()
  }
  const sourceKey = Keypair.fromSecret(decryptedPrivateKey)

  const server = getServer(connection)
  const sourceAccount = await getAccountIfExists(server, sourceKey.publicKey())

  const transaction = await newTransferTransaction(server, sourceAccount, request)

  transaction.sign(sourceKey)
  return transaction
}

export async function submitSignedTransaction(connection: Connection, transaction: Transaction) {
  const server = getServer(connection)
  await server.submitTransaction(transaction)
}

export async function generateTransferTransaction(
  sourcePublicKey: string,
  connection: Connection,
  request: TransferRequest,
): Promise<Transaction> {
  const server = getServer(connection)
  const sourceAccount = await getAccountIfExists(server, sourcePublicKey)
  return await newTransferTransaction(server, sourceAccount, request)
}

async function newTransferTransaction(
  server: Server,
  source: Account,
  request: TransferRequest,
): Promise<Transaction> {
  try {
    await getAccountIfExists(server, request.payeePublicKey)
    return newPaymentTransferTransaction(server, source, request)
  } catch (e) {
    return newCreateAccountTransaction(server, source, request)
  }
}

async function newPaymentTransferTransaction(
  server: Server,
  source: Account,
  { amount, payeePublicKey: destination, memo }: TransferRequest,
): Promise<Transaction> {
  const fee = await getFeeInStroops(server, Number(amount))
  const paymentTransaction = new TransactionBuilder(source, { fee })
    .addOperation(
      Operation.payment({
        amount,
        destination,
        asset: Asset.native(),
      }),
  )
    .addMemo(Memo.text(memo || ''))
    .build()

  return paymentTransaction
}

async function newCreateAccountTransaction(
  server: Server,
  source: Account,
  { amount: startingBalance, payeePublicKey: destination, memo }: TransferRequest,
): Promise<Transaction> {
  const fee = await getFeeInStroops(server, Number(startingBalance))
  const createAccountTransaction = new TransactionBuilder(source, { fee })
    .addOperation(
      Operation.createAccount({
        destination,
        startingBalance,
      }),
  )
    .addMemo(Memo.text(memo || ''))
    .build()

  return createAccountTransaction
}
