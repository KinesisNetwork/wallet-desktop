import { WalletLockError } from '@helpers/errors'
import { getAccountIfExists } from '@services/accounts'
import { getFeeInStroops, getServer } from '@services/kinesis'
import { Connection, TransferRequest, Wallet } from '@types'
import { Account, Asset, Keypair, Memo, Operation, Server, Transaction, TransactionBuilder } from 'js-kinesis-sdk'

export async function transferKinesis(
  sourceWallet: Wallet,
  connection: Connection,
  request: TransferRequest,
): Promise<void> {
  if (!sourceWallet.decryptedPrivateKey) {
    throw new WalletLockError()
  }
  const server = getServer(connection)
  const sourceAccount = await getAccountIfExists(server, sourceWallet.publicKey)

  const transaction = await newTransferTransaction(server, sourceAccount, request)

  transaction.sign(Keypair.fromSecret(sourceWallet.decryptedPrivateKey))
  await server.submitTransaction(transaction)
}

async function newTransferTransaction(
  server: Server,
  source: Account,
  request: TransferRequest,
): Promise<Transaction> {
  try {
    await getAccountIfExists(server, request.targetAddress)
    return newPaymentTransferTransaction(server, source, request)
  } catch (e) {
    return newCreateAccountTransaction(server, source, request)
  }
}

async function newPaymentTransferTransaction(
  server: Server,
  source: Account,
  {amount, targetAddress: destination, memo}: TransferRequest,
): Promise<Transaction> {
  const fee = await getFeeInStroops(server, Number(amount))
  const paymentTransaction = new TransactionBuilder(source, {fee})
    .addOperation(Operation.payment({
      amount,
      asset: Asset.native(),
      destination,
    }))
    .addMemo(Memo.text(memo || ''))
    .build()

  return paymentTransaction
}

async function newCreateAccountTransaction(
  server: Server,
  source: Account,
  {amount: startingBalance, targetAddress: destination, memo}: TransferRequest,
): Promise<Transaction> {
  const fee = await getFeeInStroops(server, Number(startingBalance))
  const createAccountTransaction = new TransactionBuilder(source, {fee})
    .addOperation(Operation.createAccount({
      destination,
      startingBalance,
    }))
    .addMemo(Memo.text(memo || ''))
    .build()

  return createAccountTransaction
}
