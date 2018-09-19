import { BaseOperationRecord } from 'js-kinesis-sdk'
declare module 'js-kinesis-sdk' {
  interface BaseOperationRecord {
    transaction_hash: string
  }
}
