import * as React from 'react'
import { connect } from 'react-redux'

import { AmountPresentation } from '@containers/TransferCurrency/AmountPresentation'
import { RootState } from '@store'
import { Currency } from '@types'

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

type Props = ReturnType<typeof mapStateToProps>

export const TransferSummaryPresentation: React.SFC<Props> = ({ amount, currency, fee, memo }) => (
  <React.Fragment>
    <div className="has-text-centered content">
      <AmountPresentation amount={amount} text={currency} currency={currency} />
      <p className="has-text-grey-lighter">{memo && <q>{memo}</q>}</p>
    </div>
    <hr className="has-background-grey-lighter" style={{ marginBottom: '0' }} />
    <table className="table is-fullwidth is-marginless">
      <tbody>
        <TransferTableRow
          description="Transaction Fee"
          amount={Number(fee).toFixed(5)}
          currency={currency}
        />
        <TransferTableRow
          description="TOTAL"
          amount={(Number(amount) + Number(fee)).toFixed(5)}
          currency={currency}
        />
      </tbody>
    </table>
    <hr className="has-background-grey-lighter" style={{ marginTop: '0' }} />
  </React.Fragment>
)

const TransferTableRow: React.SFC<TransferTableRow> = ({ amount, currency, description }) => (
  <tr>
    <td>{description}</td>
    <td className="has-text-right">
      {Number(amount)} {currency}
    </td>
  </tr>
)

const TransferSummary = connect(mapStateToProps)(TransferSummaryPresentation)

export { TransferSummary }
