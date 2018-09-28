import * as React from 'react'

import { addMetalColour } from '@helpers/walletUtils'
import { RootState } from '@store'
import { connect } from 'react-redux'

const mapStateToProps = (state: RootState) => {
  const {
    transfer: {
      formData: { memo, fee, amount },
    },
  } = state
  return {
    currency: state.connections.currentCurrency,
    memo,
    fee,
    amount,
  }
}

interface TransferTableRow {
  description: string
  amount: string
}

type Props = TransferTableRow & ReturnType<typeof mapStateToProps>

export const TransferSummaryPresentation: React.SFC = (props: Props) => {
  return (
    <React.Fragment>
      <div className="has-text-centered content">
        <h1 className={`is-size-1 has-text-weight-bold ${addMetalColour(props.currency)}`}>
          {Number(props.amount).toFixed(5)} {props.currency}
        </h1>
        <p className="has-text-grey-lighter">{props.memo && <q>{props.memo}</q>}</p>
      </div>
      <hr className="has-background-grey-lighter" style={{ marginBottom: '0' }} />
      <table className="table is-fullwidth is-marginless">
        <tbody>
          <TransferTableRow description="Transaction fee" amount={Number(props.fee).toFixed(5)} />
          <TransferTableRow
            description="TOTAL"
            amount={(Number(props.amount) + Number(props.fee)).toFixed(5)}
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
    <td className="has-text-right">{Number(props.amount)}</td>
  </tr>
)

const ConnectedTransferSummary = connect(mapStateToProps)(TransferSummaryPresentation)

export { ConnectedTransferSummary as TransferSummary }
