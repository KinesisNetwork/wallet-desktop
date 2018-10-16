import * as React from 'react'
import { connect } from 'react-redux'

import { updateTransferForm } from '@actions'
import { InputField } from '@components/InputField'
import { RootState } from '@store'

const mapStateToProps = ({ transfer: { formMeta, formData }, connections }: RootState) => ({
  amount: formData.amount,
  currency: connections.currentCurrency,
  errors: formMeta.errors,
  memo: formData.memo,
})

const mapDispatchToProps = {
  updateTransferForm,
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const TransferFormDetailsPresentation: React.SFC<Props> = props => {
  const { updateTransferForm: handleChange } = props

  return (
    <React.Fragment>
      <InputField
        id="transfer-amount"
        value={props.amount}
        placeholder={`0 ${props.currency}`}
        onChangeHandler={newValue => handleChange({ field: 'amount', newValue })}
        label="Amount"
        errorText={props.errors.amount}
      />
      <InputField
        id="transfer-description"
        value={props.memo}
        onChangeHandler={newValue => handleChange({ field: 'memo', newValue })}
        label="Description"
        placeholder="Optional"
        helpText={`${props.memo.length || 0} / 25`}
        errorText={props.errors.memo}
      />
    </React.Fragment>
  )
}

const TransferFormDetails = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransferFormDetailsPresentation)

export { TransferFormDetails }
