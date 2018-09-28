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
import { Connection, ImageSize, TransferRequest } from '@types'
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
    await getAccountIfExists(server, request.targetPayee)
    return newPaymentTransferTransaction(server, source, request)
  } catch (e) {
    return newCreateAccountTransaction(server, source, request)
  }
}

async function newPaymentTransferTransaction(
  server: Server,
  source: Account,
  { amount, targetPayee: destination, memo }: TransferRequest,
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
  { amount: startingBalance, targetPayee: destination, memo }: TransferRequest,
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

export const setImageSize = size => {
  switch (size) {
    case ImageSize.small:
      return { image: 'is-32x32', font: 'is-size-6' }
      break
    case ImageSize.large:
      return { image: 'is-128x128', font: 'is-size-1' }
      break
    case ImageSize.medium:
    default:
      return { image: 'is-64x64', font: 'is-size-3' }
  }
}
