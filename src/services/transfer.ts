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

import {
  Asset as SAsset,
  Keypair as SKeypair,
  Memo as SMemo,
  Operation as SOperation,
  Transaction as STransaction,
  TransactionBuilder as STransactionBuilder,
} from 'stellar-sdk'

import { HorizonError, WalletLockError } from '@helpers/errors'
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
  let sourceKey: any
  if (connection.passphrase === 'KEM UAT' || connection.passphrase === 'KEM LIVE') {
    sourceKey = SKeypair.fromSecret(decryptedPrivateKey)
  } else {
    sourceKey = Keypair.fromSecret(decryptedPrivateKey)
  }

  const server = getServer(connection)
  const sourceAccount = await getAccountIfExists(server, sourceKey.publicKey())

  const transaction = await newTransferTransaction(
    server,
    sourceAccount,
    request,
    connection.passphrase,
  )

  transaction.sign(sourceKey)
  return transaction as Transaction
}

export async function submitSignedTransaction(connection: Connection, transaction: Transaction) {
  const server = getServer(connection)
  const TIMEOUT_IN_MS = 10000
  return await transactionWithTimeout(server.submitTransaction(transaction), TIMEOUT_IN_MS)
}

function transactionWithTimeout(transactionSubmit: Promise<any>, ms: number) {
  const rejectOnTimeout = new Promise((_, reject) => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout)
      reject(new HorizonError('Unknown result from Horizon. Check your transaction list.'))
    }, ms)
  })

  return Promise.race([transactionSubmit, rejectOnTimeout])
}

export async function generateTransferTransaction(
  sourcePublicKey: string,
  connection: Connection,
  request: TransferRequest,
): Promise<Transaction | STransaction> {
  const server = getServer(connection)
  const sourceAccount = await getAccountIfExists(server, sourcePublicKey)
  return await newTransferTransaction(server, sourceAccount, request, connection.passphrase)
}

async function newTransferTransaction(
  server: Server,
  source: Account,
  request: TransferRequest,
  passphrase: string,
): Promise<Transaction | STransaction> {
  try {
    await getAccountIfExists(server, request.targetPayee)
    return newPaymentTransferTransaction(server, source, request, passphrase)
  } catch (e) {
    return newCreateAccountTransaction(server, source, request, passphrase)
  }
}

async function newPaymentTransferTransaction(
  server: Server,
  source: Account,
  { amount, targetPayee: destination, memo }: TransferRequest,
  passphrase: string,
): Promise<Transaction | STransaction> {
  const fee = await getFeeInStroops(server, Number(amount), source.accountId(), passphrase)
  if (passphrase === 'KEM UAT' || passphrase === 'KEM LIVE') {
    const paymentTransaction = new STransactionBuilder(source, { fee })
      .addOperation(
        SOperation.payment({
          amount,
          destination,
          asset: SAsset.native(),
        }),
      )
      .addMemo(SMemo.text(memo || ''))
      .setNetworkPassphrase(passphrase)
      .setTimeout(30)
      .build()
    return paymentTransaction
  } else {
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
}

async function newCreateAccountTransaction(
  server: Server,
  source: Account,
  { amount: startingBalance, targetPayee: destination, memo }: TransferRequest,
  passphrase: string,
): Promise<Transaction | STransaction> {
  const fee = await getFeeInStroops(server, Number(startingBalance), source.accountId(), passphrase)
  if (passphrase === 'KEM UAT' || passphrase === 'KEM LIVE') {
    const createAccountTransaction = new STransactionBuilder(source, { fee })
      .addOperation(
        SOperation.createAccount({
          destination,
          startingBalance,
        }),
      )
      .addMemo(SMemo.text(memo || ''))
      .setNetworkPassphrase(passphrase)
      .setTimeout(30)
      .build()
    return createAccountTransaction
  } else {
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
}
