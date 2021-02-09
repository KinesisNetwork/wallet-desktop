import * as React from 'react'
import { connect } from 'react-redux'

import { updateTransferForm } from '@actions'
import { InputField } from '@components/InputField'
import { validateAmount } from '@services/util'
import { RootState } from '@store'
import { ConnectionStage, Currency } from '@types'

const mapStateToProps = ({ transfer: { formMeta, formData }, connections }: RootState) => ({
  amount: formData.amount,
  currency: connections.currentCurrency,
  errors: formMeta.errors,
  memo: formData.memo,
  isTestnet: connections.currentStage === ConnectionStage.testnet,
})

const mapDispatchToProps = {
  updateTransferForm,
}

function isValidAmount(amount: string, currency: Currency) {
  return amount === '' || validateAmount(amount, currency)
}

function handleAmountChange(updateFormHandler: Props['updateTransferForm'], currency: Currency) {
  return (amount: string) => {
    const isValid = isValidAmount(amount, currency)

    if (isValid) {
      return updateFormHandler({ field: 'amount', newValue: amount })
    }

    return false
  }
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const TransferFormDetailsPresentation: React.SFC<Props> = props => {
  const { updateTransferForm: handleChange } = props

  return (
    <React.Fragment>
      <InputField
        id="transfer-amount"
        value={props.amount}
        placeholder={`0 ${props.isTestnet ? 'T' + props.currency : props.currency}`}
        onChangeHandler={handleAmountChange(handleChange, props.currency)}
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
