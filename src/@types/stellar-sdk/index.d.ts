/* tslint:disable:max-classes-per-file trailing-comma variable-name */
declare module 'stellar-sdk' {
  export class Account {
    constructor(accountId: string, sequence: string | number)
    public accountId(): string
    public sequenceNumber(): string
    public incrementSequenceNumber(): void
  }

  export class CallBuilder<T extends CallBuilder.Record> {
    constructor(serverUrl: string)
    public call(): Promise<CallBuilder.CollectionPage<T>>
    public cursor(cursor: string): this
    public limit(limit: number): this
    public order(direction: 'asc' | 'desc'): this
    public stream(options?: {onmessage?: () => void, onerror?: () => void}): () => void
  }

  export namespace CallBuilder {
    export interface CollectionPage<T extends Record> {
      records: T[],
      next: () => Promise<CollectionPage<T>>,
      prev: () => Promise<CollectionPage<T>>,
    }

    export interface Record {
      _links: {
        [key: string]: RecordLink
      }
    }

    export interface RecordLink {
      href: string
      templated?: boolean
    }

    /* Due to a bug with the recursive function requests */
    export interface CollectionRecord<T extends Record> {
      _links: {
        next: RecordLink
        prev: RecordLink
        self: RecordLink
      }
      _embedded: {
        records: T[]
      }
    }

    export interface CallFunctionTemplateOptions {
      cursor?: string | number
      limit?: number
      order?: 'asc' | 'desc'
    }

    export type CallFunction<T extends Record> = () => Promise<T>
    export type CallCollectionFunction<T extends Record> = (options?: CallFunctionTemplateOptions) => Promise<CollectionRecord<T>>

    export interface AccountRecord extends Record {
      id: string
      paging_token: string
      account_id: string
      sequence: number
      subentry_count: number
      thresholds: {
        low_threshold: number
        med_threshold: number
        high_threshold: number
      }
      flags: {
        auth_required: boolean
        auth_revocable: boolean
      }
      balances: Array<
        {
          balance: string
          asset_type: 'native'
        } |
        {
          balance: string
          limit: string
          asset_type: 'credit_alphanum4' | 'credit_alphanum12'
          asset_code: string
          asset_issuer: string
        }
      >
      signers: Array<
        {
          public_key: string
          weight: number
        }
      >
      data: {
        [key: string]: string
      }

      effects: CallCollectionFunction<EffectRecord>
      offers: CallCollectionFunction<OfferRecord>
      operations: CallCollectionFunction<OperationRecord>
      payments: CallCollectionFunction<PaymentOperationRecord>
      trades: CallCollectionFunction<TradeRecord>
    }

    export interface AssetRecord extends Record {
      asset_type: 'credit_alphanum4' | 'credit_alphanum12'
      asset_code: string
      asset_issuer: string
      paging_token: string
      amount: string
      num_accounts: number
      flags: {
        auth_required: boolean
        auth_revocable: boolean
      }
    }

    export interface EffectRecord extends Record {
      account: string
      paging_token: string
      starting_balance: string
      type_i: string
      type: string

      operation?: CallFunction<OperationRecord>
      precedes?: CallFunction<EffectRecord>
      succeeds?: CallFunction<EffectRecord>
    }

    export interface LedgerRecord extends Record {
      id: string
      paging_token: string
      hash: string
      prev_hash: string
      sequence: number
      transaction_count: number
      operation_count: number
      closed_at: string
      total_coins: string
      fee_pool: string
      base_fee: number
      base_reserve: string
      max_tx_set_size: number
      protocol_version: number
      header_xdr: string
      base_fee_in_stroops: number
      base_reserve_in_stroops: number

      effects: CallCollectionFunction<EffectRecord>
      operations: CallCollectionFunction<OperationRecord>
      self: CallFunction<LedgerRecord>
      transactions: CallCollectionFunction<TransactionRecord>
    }

    export interface OfferRecord extends Record {
      id: string
      paging_token: string
      seller_attr: string
      selling: Asset
      buying: Asset
      amount: string
      price_r: { numerator: number, denominator: number }
      price: string

      seller?: CallFunction<AccountRecord>
    }

    export interface BaseOperationRecord extends Record {
      id: string
      paging_token: string
      type: string
      type_i: number

      self: CallFunction<OperationRecord>
      succeeds: CallFunction<OperationRecord>
      precedes: CallFunction<OperationRecord>
      effects: CallCollectionFunction<EffectRecord>
      transaction: CallFunction<TransactionRecord>
    }

    export interface CreateAccountOperationRecord extends BaseOperationRecord {
      type: 'create_account'
      account: string
      funder: string
      starting_balance: string
    }

    export interface PaymentOperationRecord extends BaseOperationRecord {
      type: 'payment'
      from: string
      to: string
      asset_type: string
      asset_code?: string
      asset_issuer?: string
      amount: string

      sender: CallFunction<AccountRecord>
      receiver: CallFunction<AccountRecord>
    }

    export interface PathPaymentOperationRecord extends BaseOperationRecord {
      type: 'path_payment'
      from: string
      to: string
      asset_code?: string
      asset_issuer?: string
      asset_type: string
      amount: string
      source_asset_code?: string
      source_asset_issuer?: string
      source_asset_type: string
      source_max: string
      source_amount: string
    }

    export interface ManageOfferOperationRecord extends BaseOperationRecord {
      type: 'manage_offer'
      offer_id: number
      amount: string
      buying_asset_code?: string
      buying_asset_issuer?: string
      buying_asset_type: string
      price: string
      price_r: { numerator: number, denominator: number }
      selling_asset_code?: string
      selling_asset_issuer?: string
      selling_asset_type: string
    }

    export interface PassiveOfferOperationRecord extends BaseOperationRecord {
      type: 'create_passive_offer'
      offer_id: number
      amount: string
      buying_asset_code?: string
      buying_asset_issuer?: string
      buying_asset_type: string
      price: string
      price_r: { numerator: number, denominator: number }
      selling_asset_code?: string
      selling_asset_issuer?: string
      selling_asset_type: string
    }

    export interface SetOptionsOperationRecord extends BaseOperationRecord {
      type: 'set_options'
      signer_key?: string
      signer_weight?: number
      master_key_weight?: number
      low_threshold?: number
      med_threshold?: number
      high_threshold?: number
      home_domain?: string
      set_flags: Array<(1 | 2)>
      set_flags_s: Array<('auth_required_flag' | 'auth_revocable_flag')>
      clear_flags: Array<(1 | 2)>
      clear_flags_s: Array<('auth_required_flag' | 'auth_revocable_flag')>
    }

    export interface ChangeTrustOperationRecord extends BaseOperationRecord {
      type: 'change_trust'
      asset_code: string
      asset_issuer: string
      asset_type: string
      trustee: string
      trustor: string
      limit: string
    }

    export interface AllowTrustOperationRecord extends BaseOperationRecord {
      type: 'allow_trust'
      asset_code: string
      asset_issuer: string
      asset_type: string
      authorize: boolean
      trustee: string
      trustor: string
    }

    export interface AccountMergeOperationRecord extends BaseOperationRecord {
      type: 'account_merge'
      into: string
    }

    export interface InflationOperationRecord extends BaseOperationRecord {
      type: 'inflation'
    }

    export interface ManageDataOperationRecord extends BaseOperationRecord {
      type: 'manage_data'
      name: string
      value: string
    }

    type OperationRecord = CreateAccountOperationRecord
      | PaymentOperationRecord
      | PathPaymentOperationRecord
      | ManageOfferOperationRecord
      | PassiveOfferOperationRecord
      | SetOptionsOperationRecord
      | ChangeTrustOperationRecord
      | AllowTrustOperationRecord
      | AccountMergeOperationRecord
      | InflationOperationRecord
      | ManageDataOperationRecord

    export interface OrderbookRecord extends Record {
      bids: Array<{price_r: {}, price: number, amount: string}>
      asks: Array<{price_r: {}, price: number, amount: string}>
      selling: Asset
      buying: Asset
    }

    export interface PaymentPathRecord extends Record {
      path: Array<{
        asset_code: string
        asset_issuer: string
        asset_type: string
      }>
      source_amount: string
      source_asset_type: string
      source_asset_code: string
      source_asset_issuer: string
      destination_amount: string
      destination_asset_type: string
      destination_asset_code: string
      destination_asset_issuer: string
    }

    export interface TradeRecord extends Record {
      id: string
      paging_token: string
      ledger_close_time: string
      base_account: string
      base_amount: string
      base_asset_type: string
      base_asset_code: string
      base_asset_issuer: string
      counter_account: string
      counter_amount: string
      counter_asset_type: string
      counter_asset_code: string
      counter_asset_issuer: string
      base_is_seller: boolean

      base: CallFunction<AccountRecord>
      counter: CallFunction<AccountRecord>
      operation: CallFunction<OperationRecord>
    }

    export interface TradeAggregationRecord extends Record {
      timestamp: string
      trade_count: number
      base_volume: string
      counter_volume: string
      avg: string
      high: string
      low: string
      open: string
      close: string
    }

    export interface TransactionRecord extends Record {
      id: string
      paging_token: string
      hash: string
      ledger_attr: number
      created_at: string
      account_attr: string
      account_seuqence: number
      max_fee: number
      fee_paid: number
      operation_count: number
      result_code: number
      result_code_s: string
      envelope_xdr: string
      result_xdr: string
      result_meta_xdr: string
      memo: string

      account: CallFunction<AccountRecord>
      effects: CallCollectionFunction<EffectRecord>
      ledger: CallFunction<LedgerRecord>
      operations: CallCollectionFunction<OperationRecord>
      precedes: CallFunction<TransactionRecord>
      self: CallFunction<TransactionRecord>
      succeeds: CallFunction<TransactionRecord>
    }
  }

  export class AccountCallBuilder extends CallBuilder<CallBuilder.AccountRecord> {
    public accountId(id: string): this
  }
  export class AccountResponse implements CallBuilder.AccountRecord {
    public _links: { [key: string]: { href: string } }
    public id: string
    public paging_token: string
    public account_id: string
    public sequence: number
    public subentry_count: number
    public thresholds: {
      low_threshold: number
      med_threshold: number
      high_threshold: number
    }
    public flags: {
      auth_required: boolean
      auth_revocable: boolean
    }
    public balances: Array<
      {
        balance: string
        asset_type: 'native'
      } |
      {
        balance: string
        limit: string
        asset_type: 'credit_alphanum4' | 'credit_alphanum12'
        asset_code: string
        asset_issuer: string
      }
    >
    public signers: Array<
      {
        public_key: string
        weight: number
      }
    >
    public data: {
      [key: string]: string
    }

    public effects: CallBuilder.CallCollectionFunction<CallBuilder.EffectRecord>
    public offers: CallBuilder.CallCollectionFunction<CallBuilder.OfferRecord>
    public operations: CallBuilder.CallCollectionFunction<CallBuilder.OperationRecord>
    public payments: CallBuilder.CallCollectionFunction<CallBuilder.PaymentOperationRecord>
    public trades: CallBuilder.CallCollectionFunction<CallBuilder.TradeRecord>
    constructor(response: CallBuilder.AccountRecord)
    public accountId(): string
    public sequenceNumber(): string
    public incrementSequenceNumber(): void
  }

  export class Asset {
    public static native(): Asset
    constructor(code: string, issuer: string)

    public getCode(): string
    public getIssuer(): string
    public getAssetType(): 'native' | 'credit_alphanum4' | 'credit_alphanum12'
    public isNative(): boolean
    public equals(other: Asset): boolean
  }

  export class AssetsCallBuilder extends CallBuilder<CallBuilder.AssetRecord> {
    public forCode(value: string): this
    public forIssuer(value: string): this
  }

  export namespace Config {
    export function setAllowHttp(allow: boolean): void
    export function isAllowHttp(): boolean
    export function setDefault(): void
  }

  export class EffectCallBuilder extends CallBuilder<CallBuilder.EffectRecord> {
    public forAccount(accountId: string): this
    public forLedger(sequence: string): this
    public forOperation(operationId: number): this
    public forTransaction(transactionId: string): this
  }

  export interface FederationRecord {
    account_id: string
    memo_type?: string
    memo?: string
  }

  export interface FederationOptions {
    allowHttp: boolean
  }
  export class FederationServer {
    public static createForDomain(domain: string, options?: FederationOptions): Promise<FederationServer>
    public static resolve(value: string, options?: FederationOptions): Promise<FederationRecord>

    constructor(serverURL: string, domain: string, options?: FederationOptions)
    public resolveAccountId(account: string): Promise<FederationRecord>
    public resolveAddress(address: string): Promise<FederationRecord>
    public resolveTransactionId(transactionId: string): Promise<FederationRecord>
  }

  export class LedgerCallBuilder extends CallBuilder<CallBuilder.LedgerRecord> {}

  export class Memo {
    public static hash(hash: string): Memo
    public static id(id: string): Memo
    public static none(): Memo
    public static return(hash: string): Memo
    public static text(text: string): Memo
    constructor(type: 'MemoNone')
    constructor(type: 'MemoID' | 'MemoText', value: string)
    constructor(type: 'MemoHash' | 'MemoReturn', value: Buffer)
  }

  export enum Networks {
    PUBLIC = 'Public Global Stellar Network ; September 2015',
    TESTNET = 'Test SDF Network ; September 2015',
  }

  export class Network {
    public static use(network: Network): void
    public static usePublicNetwork(): void
    public static useTestNetwork(): void
    public static current(): Network

    constructor(passphrase: string)

    public networkPassphrase(): string
    public networkId(): string
  }

  export class OfferCallBuilder extends CallBuilder<CallBuilder.OfferRecord> {}

  export namespace Operation {
    export interface AccountMergeOptions {
      destination: string
      source?: string
    }
    export function accountMerge(options: AccountMergeOptions): xdr.Operation
    export interface AllowTrustOptions {
      trustor: string
      assetCode: string
      authorize: boolean
      source?: string
    }
    export function allowTrust(options: AllowTrustOptions): xdr.Operation
    export interface ChangeTrustOptions {
      asset: Asset
      limit: string
      source?: string
    }
    export function changeTrust(options: ChangeTrustOptions): xdr.Operation
    export interface CreateAccountOptions {
      destination: string
      startingBalance: string
      source?: string
    }
    export function createAccount(options: CreateAccountOptions): xdr.Operation
    export interface CreatePassiveOfferOptions {
      selling: Asset
      buying: Asset
      amount: string
      price: number | string | object
      source?: string
    }
    export function createPassiveOffer(options: CreatePassiveOfferOptions): xdr.Operation
    export function inflation(options: {source?: string}): xdr.Operation

    export interface ManageDataOptions {
      name: string
      value: string | Buffer
      source?: string
    }
    export function manageData(options: ManageDataOptions): xdr.Operation

    export interface ManageOfferOptions extends CreatePassiveOfferOptions {
      offerId: number | string
    }
    export function manageOffer(options: ManageOfferOptions): xdr.Operation

    export interface PathPaymentOptions {
      sendAsset: Asset
      sendMax: string
      destination: string
      destAsset: Asset
      destAmount: string
      path: Asset[]
      source?: string
    }
    export function pathPayment(options: PathPaymentOptions): xdr.Operation

    export interface PaymentOptions {
      destination: string
      asset: Asset
      amount: string
      source?: string
    }
    export function payment(options: PaymentOptions): xdr.Operation

    /*
     * Required = 1 << 0
     * Revocable = 1 << 1
     * Immutable = 1 << 2
     */
    export enum AuthFlags {
      Required = 1,
      Revocable = 2,
      Immutable = 4,
    }
    export interface Signer {
      ed25519PublicKey?: string
      sha256Hash?: Buffer | string
      preAuthTx?: Buffer | string
      weight?: number | string
    }
    export interface SetOptionsOptions {
      inflationDest?: string
      clearFlags?: AuthFlags
      setFlags?: AuthFlags
      masterWeight?: number | string
      lowThreshold?: number | string
      medThreshold?: number | string
      highThreshold?: number | string
      signer?: Signer
      homeDomain?: string
      source?: string
    }
    export function setOptions(options: SetOptionsOptions): xdr.Operation
  }

  export class OperationCallBuilder extends CallBuilder<CallBuilder.OperationRecord> {}
  export class OrderbookCallBuilder extends CallBuilder<CallBuilder.OrderbookRecord> {}
  export class PathCallBuilder extends CallBuilder<CallBuilder.PaymentPathRecord> {}
  export class PaymentCallBuilder extends CallBuilder<CallBuilder.PaymentOperationRecord> {}

  export class Server {
    constructor(serverURL: string, options?: {allowHttp: boolean})
    public accounts(): AccountCallBuilder
    public assets(): AssetsCallBuilder
    public effects(): EffectCallBuilder
    public ledgers(): LedgerCallBuilder
    public loadAccount(accountId: string): Promise<AccountResponse>
    public offers(resource: string, ...parameters: string[]): OfferCallBuilder
    public operations(): OperationCallBuilder
    public orderbook(selling: Asset, buying: Asset): OrderbookCallBuilder
    public paths(
      source: string,
      destination: string,
      destinationAsset: Asset,
      destinationAmount: string,
    ): PathCallBuilder
    public payments(): PaymentCallBuilder
    public submitTransaction(transaction: Transaction): Promise<any>
    public tradeAggregation(
      base: Asset,
      counter: Asset,
      startTime: Date,
      endTime: Date,
      resolution: Date,
    ): TradeAggregationCallBuilder
    public trades(): TradesCallBuilder
    public transactions(): TransactionCallBuilder
  }

  export namespace StrKey {
    export function encodeEd25519PublicKey(data: Buffer): string
    export function decodeEd25519PublicKey(data: string): Buffer
    export function isValidEd25519PublicKey(publicKey: string): boolean

    export function encodeEd25519SecretSeed(data: Buffer): string
    export function decodeEd25519SecretSeed(data: string): Buffer
    export function isValidEd25519SecretSeed(seed: string): boolean

    export function encodePreAuthTx(data: Buffer): string
    export function decodePreAuthTx(data: string): Buffer

    export function encodeSha256Hash(data: Buffer): string
    export function decodeSha256Hash(data: string): Buffer
  }

  export class TradeAggregationCallBuilder extends CallBuilder<CallBuilder.TradeAggregationRecord> {}
  export class TradesCallBuilder extends CallBuilder<CallBuilder.TradeRecord> {
    public forAssetPair(base: Asset, counter: Asset): this
    public forOffer(offerId: string): this
  }

  export class Transaction {
    constructor(envelope: string | xdr.TransactionEnvelope)
    public hash(): Buffer
    public sign(...keypairs: Keypair[]): void
    public signatureBase(): Buffer
    public signHashX(preimage: Buffer | string): void
    public toEnvelope(): xdr.TransactionEnvelope
  }

  export class TransactionBuilder {
    constructor(sourceAccount: string, options: TransactionBuilder.TransactionBuilderOptions)
    public addOperation(operation: xdr.Operation): this
    public addMemo(memo: Memo): this
    public build(): Transaction
  }

  export namespace TransactionBuilder {
    export interface TransactionBuilderOptions {
      fee: number
      timebounds: {
        minTime: number | string
        maxTime: number | string
      }
      memo: Memo
    }
  }

  export class TransactionCallBuilder extends CallBuilder<CallBuilder.TransactionRecord> {
    public transaction(transactionId: string): this
    public forAccount(accountId: string): this
    public forLedger(sequence: string | number): this
  }

  export class Keypair {
    public static fromRawEd25519Seed(secretSeed: Buffer): Keypair
    public static fromSecret(secretKey: string): Keypair
    public static master(): Keypair
    public static fromPublicKey(publicKey: string): Keypair
    public static random(): Keypair

    constructor(keys: {type: 'ed25519', secretKey: string} | {type: 'ed25519', publicKey: string})

    public publicKey(): string
    public secret(): string
    public rawSecretKey(): Buffer
    public canSign(): boolean
    public sign(data: Buffer): Buffer
    public verify(data: Buffer, signature: Buffer): boolean
  }

  export namespace xdr {
    export class Operation {}
    export class Asset {}
    export class Memo {}
    export class TransactionEnvelope {}
  }
}
