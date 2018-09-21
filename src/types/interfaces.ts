import { CollectionPage, Keypair, OperationRecord, TransactionRecord } from 'js-kinesis-sdk'

export interface Wallet {
  publicKey: string
  encryptedPrivateKey: string
  accountName: string
}

export interface Connection {
  endpoint: string
  passphrase: string
}

export interface ViewParams {
  walletIndex: number
}

export interface CreateWalletForm {
  readonly accountName: string
  readonly privateKey: string
  readonly password: string
  readonly passwordVerify: string
}

export interface Account {
  readonly balance: string
  readonly isUnlocked: boolean
}

export interface UnlockWallet {
  readonly password: string
  readonly publicKey: string
  readonly decryptedPrivateKey: string
}

export interface TransferRequest {
  readonly targetPayee: string
  readonly amount: string
  readonly memo: string
}

export interface FormUpdate<T> {
  field: keyof T
  newValue: string
}

export interface TransactionOperationView {
  readonly source: string
  readonly isIncoming: boolean
  readonly fee: string
  readonly memo: string
  readonly operation: OperationRecord
  readonly date: Date
}

export interface Contact {
  readonly name: string
  readonly address: string
}

export type FormChangeHandler<T> = (change: FormUpdate<T>) => any

export interface SignedMessage extends RawMessage {
  readonly publicKey: string
  readonly signature: string
}

export interface RawMessage {
  readonly message: string
}

export interface FormAlert {
  message: string
  key: string
}

export interface BaseAccount {
  name: string
}

export interface PersistedAccount extends BaseAccount {
  encryptedSecret: string
}

export interface WalletAccount extends BaseAccount {
  keypair: Keypair
}

export interface WalletLoggedInState {
  accounts: WalletAccount[]
  passphrase: string
}
export interface FailedAttemptsToUnlockWallet {
  unlockTimestamp: number
}

export interface UnlockWalletFailure {
  now: Date
  maxAttempts: number
}

export interface TransactionLoader {
  transactionPage: CollectionPage<TransactionRecord> | null
  operations: TransactionOperationView[]
}
