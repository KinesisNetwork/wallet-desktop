import * as React from 'react'

import { HorizontalLabelledField } from '@components'
import { TransactionOperationView } from '@types'
import { OperationRecord, TransactionOperation } from 'js-kinesis-sdk'
import { startCase } from 'lodash'

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

export const TransactionCard: React.SFC<Props> = ({ transactionWithOperation: t }) => (
  <article className="message is-small is-transparent">
    <div className="message-header">
      <p>
        {!t.isIncoming && (
          <span className="icon has-text-success">
            <i className="fas fa-arrow-down" />
          </span>
        )}
        {t.isIncoming && (
          <span className="icon has-text-danger">
            <i className="fas fa-arrow-up" />
          </span>
        )}
        <span>{startCase(t.operation.type)}</span>
      </p>
    </div>
    <div className="message-body">
      {renderOperationRecords(t.operation)}
      <HorizontalLabelledField label="Fee" value={t.fee} isCompact={true} />
      <HorizontalLabelledField label="Memo" value={t.memo} isCompact={true} />
    </div>
  </article>
)
