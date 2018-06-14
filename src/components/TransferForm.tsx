import * as React from 'react'

import { InputField } from '@components'
import { TransferProps } from '@containers'
import { formAlert } from '@helpers/alert'
import { InputError, WalletLockError } from '@helpers/errors'
import { Loader } from './Loader'
import { PayeeSelector } from './PayeeSelector'

export class TransferForm extends React.Component<TransferProps> {
  constructor(props) {
    super(props)
  }

  initTransfer = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    try {
      this.validateProps()
      const continueTransfer = await swal({
        buttons: ['Cancel', 'Transfer'],
        dangerMode: true,
        icon: 'warning',
        text: `
          Once submitted, the transaction can not be reverted!
          The fee will be ${await this.props.getFee(Number(this.props.amount))} Kinesis
        `,
        title: 'Continue with transfer?',
      })

      if (!continueTransfer) {
        return
      }
      this.props.transferRequest(this.props)
    } catch (e) {
      formAlert(e.message, e.key)
    }
  }

  validateProps = () => {
    this.checkWalletIsUnlocked()
    this.checkValidTarget()
    this.checkValidAmount()
    this.checkValidMemo()
  }

  checkWalletIsUnlocked = () => {
    if (!this.props.isWalletUnlocked) {
      throw new WalletLockError()
    }
  }

  checkValidTarget = () => {
    if (!this.props.targetPayee) {
      throw new InputError(`Payee is required`, `transfer-target-address`)
    }
  }

  checkValidAmount = () => {
    if (Number(this.props.amount) > Number(this.props.accountBalance)) {
      throw new InputError('Transfer amount is higher than account balance', 'transfer-amount')
    } else if (Number(this.props.amount) <= 0) {
      throw new InputError('Transfer amount must be greater than 0', 'transfer-amount')
    } else if (!this.props.amount) {
      throw new InputError('Amount is required', 'transfer-amount')
    }
  }

  checkValidMemo = () => {
    if (this.props.memo.length > 24) {
      throw new InputError('Memo must be fewer than 25 characters', 'transfer-memo')
    }
  }

  isPayeeSelected = () => {
    return this.props.payees.findIndex(({ publicKey }) => publicKey === this.props.targetPayee) !== -1
  }

  render() {
    const { updateTransferForm: handleChange } = this.props
    return (
      <div style={{ position: 'relative' }}>
        {this.props.isTransferring && <Loader />}
        <div style={this.props.isTransferring ? { filter: 'blur(2px)' } : {}}>
          <PayeeSelector
            handleChange={handleChange}
            payees={this.props.payees}
            targetPayee={this.props.targetPayee}
            changeTransferView={this.props.changeTransferView}
          />
          <InputField
            value={this.props.targetPayee}
            id='transfer-target-address'
            icon='fa-address-card'
            placeholder='Or input target address'
            isDisabled={this.isPayeeSelected()}
            onChangeHandler={(newValue) => handleChange({ field: 'targetPayee', newValue })}
          />
          <InputField
            value={this.props.amount}
            id='transfer-amount'
            icon='fa-coins'
            type='number'
            placeholder='Amount'
            onChangeHandler={(newValue) => handleChange({ field: 'amount', newValue })}
          />
          <InputField
            value={this.props.memo}
            id='transfer-memo'
            icon='fa-comment'
            placeholder='Optional message'
            onChangeHandler={(newValue) => handleChange({ field: 'memo', newValue })}
          />
          <div className='field'>
            <div className='control is-expanded'>
              <button className='button is-fullwidth' onClick={this.initTransfer}>Transfer</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
