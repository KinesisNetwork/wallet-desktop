import * as copy from 'copy-to-clipboard'
import * as React from 'react'

import { TransferProps } from '@containers/TransferForm'
import { formAlert } from '@helpers/alert'
import { InputError, WalletLockError } from '@helpers/errors'
import { generateTransferTransaction } from '@services/transfer'
import { InputField } from './InputField'
import { Loader } from './Loader'
import { PayeeSelector } from './PayeeSelector'

export class TransferForm extends React.Component<TransferProps> {
  initTransfer = async (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    try {
      await this.validateProps()
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

  validateProps = async () => {
    this.checkWalletIsUnlocked()
    this.checkValidTarget()
    await this.checkValidAmount()
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

  checkValidAmount = async () => {
    const fee = await this.props.getFee(Number(this.props.amount))

    if (Number(fee) + Number(this.props.amount) > Number(this.props.accountBalance)) {
      throw new InputError(
        `Transfer amount (including ${fee} fee) is higher than your account balance`,
        'transfer-amount',
      )
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
    return (
      this.props.payees.findIndex(({ publicKey }) => publicKey === this.props.targetPayee) !== -1
    )
  }

  copyTransferTransaction = async () => {
    const transaction = await generateTransferTransaction(
      this.props.publicKey,
      this.props.connection,
      this.props,
    )
    copy(
      transaction
        .toEnvelope()
        .toXDR()
        .toString('base64'),
    )
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
            id="transfer-target-address"
            icon="fa-address-card"
            placeholder="Or input target address"
            disabled={this.isPayeeSelected()}
            onChangeHandler={newValue => handleChange({ field: 'targetPayee', newValue })}
          />
          <InputField
            value={this.props.amount}
            id="transfer-amount"
            icon="fa-coins"
            type="number"
            placeholder="Amount"
            onChangeHandler={newValue => handleChange({ field: 'amount', newValue })}
          />
          <InputField
            value={this.props.memo}
            id="transfer-memo"
            icon="fa-comment"
            placeholder="Optional message"
            onChangeHandler={newValue => handleChange({ field: 'memo', newValue })}
          />
          <div className="field is-grouped">
            <div className="control is-expanded">
              <button className="button is-fullwidth" onClick={this.initTransfer}>
                <span>Transfer</span>
              </button>
            </div>
            <div className="control">
              <button
                className="button is-text"
                onClick={this.copyTransferTransaction}
                title="Copy Transaction"
              >
                <span className="icon">
                  <i className="fas fa-copy" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
