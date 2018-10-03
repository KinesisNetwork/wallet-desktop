import * as React from 'react'

import { AmountPresentation } from '@containers/TransferCurrency/AmountPresentation'
import { RootState } from '@store'
import { Currency } from '@types'
import { connect } from 'react-redux'

const mapStateToProps = ({
  transfer: {
    formData: { memo, fee, amount },
  },
  connections,
}: RootState) => ({
  currency: connections.currentCurrency,
  memo,
  fee,
  amount,
})

interface TransferTableRow {
  description: string
  amount: string
  currency: Currency
}

type Props = TransferTableRow & ReturnType<typeof mapStateToProps>

export const TransferSummaryPresentation: React.SFC = (props: Props) => {
  return (
    <React.Fragment>
      <div className="has-text-centered content">
        <AmountPresentation amount={props.amount} text={props.currency} currency={props.currency} />
        <p className="has-text-grey-lighter">{props.memo && <q>{props.memo}</q>}</p>
      </div>
      <hr className="has-background-grey-lighter" style={{ marginBottom: '0' }} />
      <table className="table is-fullwidth is-marginless">
        <tbody>
          <TransferTableRow
            description="Transaction fee"
            amount={Number(props.fee).toFixed(5)}
            currency={props.currency}
          />
          <TransferTableRow
            description="TOTAL"
            amount={(Number(props.amount) + Number(props.fee)).toFixed(5)}
            currency={props.currency}
          />
        </tbody>
      </table>
      <hr className="has-background-grey-lighter" style={{ marginTop: '0' }} />
    </React.Fragment>
  )
}

const TransferTableRow: React.SFC<TransferTableRow> = (props: TransferTableRow) => (
  <tr>
    <td>{props.description}</td>
    <td className="has-text-right">
      {Number(props.amount)} {props.currency}
    </td>
  </tr>
)

const TransferSummary = connect(mapStateToProps)(TransferSummaryPresentation)

export { TransferSummary }
