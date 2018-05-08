import { AccountResponse, Asset } from 'js-kinesis-sdk';
import { Connection } from '@types'
import { getServer } from '@services/server'

export async function loadAccount (
  publicKey: string,
  connection: Connection,
): Promise<AccountResponse> {
  const server = getServer(connection)
  return await server.loadAccount(publicKey)
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
