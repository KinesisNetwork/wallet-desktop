import { Account, AccountResponse, Asset, Server } from 'js-kinesis-sdk';
import { Connection } from '@types'
import { getServer } from '@services/kinesis'
import { AccountMissingError } from '@helpers/errors';

export async function loadAccount (
  publicKey: string,
  connection: Connection,
): Promise<AccountResponse> {
  try {
    const server = getServer(connection)
    return await server.loadAccount(publicKey)
  } catch (e) {
    throw new AccountMissingError()
  }
}

export async function getAccountIfExists (
  server: Server,
  publicKey: string,
): Promise<Account> {
  try {
    const account = await server.loadAccount(publicKey)
    return new Account(publicKey, account.sequence)
  } catch (e) {
    console.error(e)
    throw new AccountMissingError()
  }
}

export function getBalance (
  account: AccountResponse,
): string {
  const nativeBalance = account.balances.find((balance) => balance.asset_type === Asset.native().getAssetType())
  if (!nativeBalance) {
    throw new Error('Native balance not found')
  }
  return nativeBalance.balance
}
