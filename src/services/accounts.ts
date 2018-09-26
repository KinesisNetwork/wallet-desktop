import { Account, AccountResponse, Asset, Keypair, Server, Transaction } from 'js-kinesis-sdk'

import { AccountMissingError } from '@helpers/errors'
import { Connection } from '@types'
import { getServer } from './kinesis'

export async function loadAccount(
  publicKey: string,
  connection: Connection,
): Promise<AccountResponse> {
  try {
    const server = getServer(connection)
    return await server.loadAccount(publicKey)
  } catch (e) {
    throw new AccountMissingError(publicKey)
  }
}

export async function getAccountIfExists(server: Server, publicKey: string): Promise<Account> {
  try {
    const account = await server.loadAccount(publicKey)
    return new Account(publicKey, account.sequence)
  } catch (e) {
    throw new AccountMissingError(publicKey)
  }
}

export function getBalance(account: AccountResponse): number {
  const nativeBalance = account.balances.find(
    balance => balance.asset_type === Asset.native().getAssetType(),
  )
  return Number(nativeBalance!.balance)
}

export async function getTransactionSigners(server: Server, transaction: Transaction) {
  const account = await server.loadAccount(transaction.source)
  const signers = account.signers
    .filter(({ weight }) => weight > 0)
    .map(({ public_key }) => Keypair.fromPublicKey(public_key))

  const transactionSignatures = transaction.signatures.map((sig: any) => sig.signature())

  return signers.filter(kp => transactionSignatures.some(sig => kp.verify(transaction.hash(), sig)))
}

export const getInitials = name =>
  name
    .split(' ')
    .map(word => word.substring(0, 1))
    .reduce(
      (initials, curr, i, names) =>
        i === names.length - 1 && i !== 0 ? initials + curr : initials,
    )
