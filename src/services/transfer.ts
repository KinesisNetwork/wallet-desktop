import { WalletLockError, TransferSubmitError } from '@helpers/errors'
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

  if (request.targetAddress && request.targetPayee) {
    throw new TransferSubmitError()
  }

  const handledRequest = handleTransferWithPayee(request)

  const server = getServer(connection)
  const sourceAccount = await getAccountIfExists(server, sourceWallet.publicKey)

  const transaction = await newTransferTransaction(server, sourceAccount, handledRequest)

  transaction.sign(Keypair.fromSecret(sourceWallet.decryptedPrivateKey))
  await server.submitTransaction(transaction)
}

function handleTransferWithPayee(transfer: TransferRequest): TransferRequest {
  if (!transfer.targetPayee) {
    return transfer
  }

  return { amount: transfer.amount, targetAddress: transfer.targetPayee, memo: transfer.memo }
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
      destination,
      asset: Asset.native(),
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
