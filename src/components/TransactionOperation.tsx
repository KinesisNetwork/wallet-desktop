import {
  CreateAccountOperationRecord,
  OperationRecord,
  PaymentOperationRecord,
} from 'js-kinesis-sdk'
import * as React from 'react'

import { AddressView } from '@components/AddressView'
import { HorizontalLabelledField } from '@components/LabelledField'
import { AddressDisplay, Currency, TransactionOperationView } from '@types'

export interface Props {
  transactionWithOperation: TransactionOperationView
  currency: Currency
}

const isTransfer = (
  op: OperationRecord,
): op is PaymentOperationRecord | CreateAccountOperationRecord =>
  ['create_account', 'payment'].includes(op.type)

const getAddress = (t: TransactionOperationView) => {
  switch (t.operation.type) {
    case 'create_account':
      return t.isIncoming ? t.operation.funder : t.operation.account
    case 'payment':
      return t.isIncoming ? t.operation.from : t.operation.to
    default:
      return t.source
  }
}

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

const TransactionIcon: React.SFC<{ t: TransactionOperationView }> = ({ t }) =>
  isTransfer(t.operation) ? (
    t.isIncoming ? (
      <span className="icon is-large has-text-success">
        <i className="fal fa-lg fa-arrow-down" />
      </span>
    ) : (
        <span className="icon is-large has-text-danger">
          <i className="fal fa-lg fa-arrow-up" />
        </span>
      )
  ) : (
      <span className="icon is-large has-text-grey-light">
        <i className="fal fa-lg fa-dash" />
      </span>
    )

interface StateProps {
  moreInfoIsHidden: boolean
  toggleMoreInfo: () => any
}
const TransactionCard: React.SFC<Props & StateProps> = ({
  transactionWithOperation: t,
  currency,
  moreInfoIsHidden,
  toggleMoreInfo,
}) => (
    <article className="level">
      <div
        className="columns box level-item is-gapless has-text-grey-lighter is-multiline"
        style={{ width: '100%' }}
      >
        <div className="column is-4">
          <div className="is-flex" style={{ alignItems: 'center' }}>
            <TransactionIcon t={t} />
            <span className="has-text-weight-bold">
              <AddressView address={getAddress(t)} addressDisplay={AddressDisplay.payee} />
            </span>
          </div>
        </div>
        <div className="column is-3">
          <p>{t.memo || '(no description)'}</p>
        </div>
        <div className="column is-2">
          <span className="icon is-small has-text-success">
            <i className="fal fa-xs fa-check-circle" />
          </span>
          <span>{t.date.toTimeString().slice(0, 8)}</span>
        </div>
        <div className="column is-2 has-text-weight-bold has-text-right">
          <span className={`has-text-${t.isIncoming ? 'success' : 'danger'}`}>
            {getAmount(t)} {currency}
          </span>
        </div>
        <div className="column is-1 has-text-right">
          <button className="button is-text" onClick={toggleMoreInfo}>
            {moreInfoIsHidden && (
              <span className="icon">
                <i className="fal fa-lg fa-angle-down" />
              </span>
            )}
            {!moreInfoIsHidden && (
              <span className="icon">
                <i className="fal fa-lg fa-angle-up" />
              </span>
            )}
          </button>
        </div>
        <div className={`column is-12 ${moreInfoIsHidden ? 'is-hidden' : ''}`}>
          <HorizontalLabelledField
            label={t.isIncoming ? "Sender's Address:" : "Recipient's Address:"}
            value={getAddress(t)}
            isCompact={true}
          />
          <HorizontalLabelledField
            label="Transaction Hash:"
            value={t.operation.transaction_hash}
            isCompact={true}
          />
          <HorizontalLabelledField label="Fee:" value={`${t.fee} ${currency}`} isCompact={true} />
        </div>
      </div>
    </article>
  )

interface State {
  moreInfoIsHidden: boolean
}
class TransactionCardStateful extends React.Component<Props, State> {
  state: State = {
    moreInfoIsHidden: true,
  }

  render() {
    return (
      <TransactionCard
        moreInfoIsHidden={this.state.moreInfoIsHidden}
        toggleMoreInfo={this.toggleMoreInfo}
        {...this.props}
      />
    )
  }

  private toggleMoreInfo = () =>
    this.setState(state => ({ moreInfoIsHidden: !state.moreInfoIsHidden }))
}

export { TransactionCardStateful as TransactionCard }
