import { createHash } from 'crypto'
import {
  Account,
  AccountResponse,
  Asset,
  Keypair,
  Network,
  Server,
  Transaction,
} from 'js-kinesis-sdk'

import {
  Environment,
  KinesisCoin
} from '@abx/js-kinesis-sdk-v2'

import { AccountMissingError } from '@helpers/errors'
import { Connection, Contact, WalletAccount } from '@types'
import { getServer } from './kinesis'

interface NewAccountResponse extends AccountResponse {
  signers: Array<{
    public_key: string
    weight: number
    key?: string
  }>
}

interface FactoryParams {
  coin: KinesisCoin,
  environment: Environment
}

export function getFactoryParams(connection: Connection): FactoryParams {
  if (connection.passphrase.includes("KAG")) {
    if (connection.passphrase.includes("UAT")) {
      return {
        "coin": KinesisCoin.KAG,
        "environment": Environment.testnet
      }
    } else {
      return {
        "coin": KinesisCoin.KAG,
        "environment": Environment.mainnet
      }
    }
  } else if (connection.passphrase.includes("KEM")) {
    if (connection.passphrase.includes("UAT")) {
      return {
        "coin": KinesisCoin.KEM,
        "environment": Environment.testnet
      }
    } else {
      return {
        "coin": KinesisCoin.KEM,
        "environment": Environment.mainnet
      }
    }
  } else {
    if (connection.passphrase.includes("UAT")) {
      return {
        "coin": KinesisCoin.KAU,
        "environment": Environment.testnet
      }
    } else {
      return {
        "coin": KinesisCoin.KAU,
        "environment": Environment.mainnet
      }
    }
  }
}

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

export function getBalance(account: AccountResponse): number | string {
  const nativeBalance = account.balances.find(
    balance => balance.asset_type === Asset.native().getAssetType(),
  )
  return nativeBalance!.balance
}

export async function getTransactionSigners(server: Server, transaction: Transaction) {
  const account: NewAccountResponse = await server.loadAccount(transaction.source)
  const signers = account.signers.filter(({ weight }) => weight > 0).map(data => {
    const keys = data.public_key ? data.public_key : data.key
    return Keypair.fromPublicKey(keys!)
  })

  const transactionSignatures = transaction.signatures.map((sig: any) => sig.signature())

  return signers.filter(kp => transactionSignatures.some(sig => kp.verify(transaction.hash(), sig)))
}

export function getInactiveAccountsInContactFormat(
  accountList: WalletAccount[],
  activeAccount: WalletAccount,
): Contact[] {
  return accountList
    .filter(({ keypair }) => keypair.publicKey() !== activeAccount.keypair.publicKey())
    .map(({ name, keypair }) => ({ name, address: keypair.publicKey() }))
}

export function getEmissionKeyInContactFormat(): Contact {
  const feeSeedString = `${Network.current().networkPassphrase()}emission`
  const hash = createHash('sha256')
  hash.update(feeSeedString)

  return {
    name: 'Kinesis Mint',
    address: Keypair.fromRawEd25519Seed(hash.digest()).publicKey(),
  }
}
