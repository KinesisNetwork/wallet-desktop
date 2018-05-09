import { Wallet, Connection } from '@types';
import { getServer, getFeeInStroops } from '@services/kinesis';
import { Server, Account, Transaction, TransactionBuilder, Operation, Asset, Keypair } from 'js-kinesis-sdk';
import { getAccountIfExists } from '@services/accounts';
import { WalletLockError } from '@helpers/errors';

export async function transferKinesis (
  sourceWallet: Wallet,
  connection: Connection,
  targetAddress: string,
  amount: string,
): Promise<void> {
  if (!sourceWallet.decryptedPrivateKey) {
    throw new WalletLockError()
  }
  const server = getServer(connection)
  const sourceAccount = await getAccountIfExists(server, sourceWallet.publicKey)

  const transaction = await getAccountIfExists(server, targetAddress)
    ? await newPaymentTransferTransaction(server, sourceAccount, targetAddress, amount)
    : await newCreateAccountTransaction(server, sourceAccount, targetAddress, amount)

  transaction.sign(Keypair.fromSecret(sourceWallet.decryptedPrivateKey))
  await server.submitTransaction(transaction)
}

async function newPaymentTransferTransaction (
  server: Server,
  source: Account,
  destination: string,
  amount: string,
): Promise<Transaction> {
  const fee = await getFeeInStroops(server, amount)
  const paymentTransaction = new TransactionBuilder(source, {fee})
    .addOperation(Operation.payment({
      amount,
      destination,
      asset: Asset.native(),
    }))
    .build()

  return paymentTransaction
}

async function newCreateAccountTransaction (
  server: Server,
  source: Account,
  destination: string,
  startingBalance: string,
): Promise<Transaction> {
  const fee = await getFeeInStroops(server, startingBalance)
  const createAccountTransaction = new TransactionBuilder(source, {fee})
    .addOperation(Operation.createAccount({
      destination,
      startingBalance,
    }))
    .build()

  return createAccountTransaction
}
