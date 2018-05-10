import { AccountMissingError } from '@helpers/errors'
import { getServer } from '@services/kinesis'
import { Connection } from '@types'
import { Account, AccountResponse, Asset, Server } from 'js-kinesis-sdk'

export async function loadAccount(
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

export async function getAccountIfExists(
  server: Server,
  publicKey: string,
): Promise<Account> {
  try {
    const account = await server.loadAccount(publicKey)
    return new Account(publicKey, account.sequence)
  } catch (e) {
    throw new AccountMissingError()
  }
}

export function getBalance(
  account: AccountResponse,
): string {
  const nativeBalance = account.balances.find((balance) => balance.asset_type === Asset.native().getAssetType())
  if (!nativeBalance) {
    throw new Error('Native balance not found')
  }
  return nativeBalance.balance
}
