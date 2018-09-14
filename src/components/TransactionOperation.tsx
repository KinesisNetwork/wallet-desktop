import {
  CreateAccountOperationRecord,
  OperationRecord,
  PaymentOperationRecord,
  TransactionOperation,
} from 'js-kinesis-sdk'
import { startCase } from 'lodash'
import * as React from 'react'

import { HorizontalLabelledField } from '@components/LabelledField'
import { TransactionOperationView } from '@types'

export interface Props {
  transactionWithOperation: TransactionOperationView
}

// keyof BaseOperationRecord
const baseOperationRecordKeys = [
  'id',
  '_links',
  'effects',
  'paging_token',
  'precedes',
  'self',
  'succeeds',
  'transaction',
  'type',
  'type_i',
]

export const renderOperationRecords = (operation: OperationRecord | TransactionOperation) => {
  const entries = Object.entries(operation).filter(
    ([key, value]) => !baseOperationRecordKeys.includes(key) && ['string'].includes(typeof value),
  )
  return entries.map(([key, value]) => (
    <HorizontalLabelledField key={key} label={startCase(key)} value={value} isCompact={true} />
  ))
}

const isTransfer = (
  op: OperationRecord,
): op is PaymentOperationRecord | CreateAccountOperationRecord =>
  ['create_account', 'payment'].includes(op.type)

const getAddress = (t: TransactionOperationView) =>
  isTransfer(t.operation) && t.isIncoming
    ? t.operation.type === 'create_account'
      ? t.operation.funder
      : t.operation.from
    : t.source

const getAmount = (t: TransactionOperationView) => {
  let amount = 0
  switch (t.operation.type) {
    case 'create_account':
      amount = Number(t.operation.starting_balance)
      break
    case 'payment':
      amount = Number(t.operation.amount)
      break
    default:
      return 'Other'
  }
  return t.isIncoming ? amount : amount + Number(t.fee)
}

const TransactionCard: React.SFC<Props> = ({ transactionWithOperation: t }) => (
  <article className="level box has-text-grey-lighter">
    <div className="level-left">
      <div className="level-item">
        {isTransfer(t.operation) ? (
          t.isIncoming ? (
            <span className="icon is-medium has-text-success">
              <i className="fal fa-arrow-down" />
            </span>
          ) : (
            <span className="icon is-medium has-text-danger">
              <i className="fal fa-arrow-up" />
            </span>
          )
        ) : (
          <span className="icon is-medium has-text-grey-light">
            <i className="fal fa-dash" />
          </span>
        )}
        <h3 className="is-6">{getAddress(t)}</h3>
      </div>
    </div>
    <div className="level-item">
      <p>{t.memo}</p>
    </div>
    <div className="level-item">
      <span className="icon is-small has-text-success">
        <i className="fal fa-xs fa-check-circle" />
      </span>
      <p>{t.date.toTimeString()}</p>
    </div>
    <div className="level-item">
      <p
        className={`${t.isIncoming ? 'has-text-success' : 'has-text-danger'} has-text-weight-bold`}
      >
        {getAmount(t)}
      </p>
    </div>
    <div className="level-item" />
  </article>
)

export { TransactionCard }
