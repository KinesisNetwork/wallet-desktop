import * as React from 'react'

import { InputField } from '@components'
import { TransferProps } from '@containers'
import { formAlert } from '@helpers/alert'
import { InputError, WalletLockError } from '@helpers/errors'
import { View } from '@types'
import { Loader } from './Loader'

export class Transfer extends React.Component<TransferProps> {
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
    if (!this.props.targetAddress && !this.props.targetPayee) {
      throw new InputError(`Target Address or Payee is required`, `transfer-target-address`)
    } else if (
      this.props.targetAddress === this.props.activeWallet.publicKey ||
      this.props.targetPayee === this.props.activeWallet.publicKey
    ) {
      throw new InputError('Target Address or Payee cannot be your own key', 'transfer-target-address')
    } else if (this.props.targetAddress && this.props.targetPayee) {
      throw new InputError('Target Address and Payee cannot both be set', 'transfer-target-address')
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

  payees = () => {
    return this.props.payees.map((payee, i) => <option value={payee.publicKey} key={i}>{payee.name}</option>)
  }

  render() {
    return (
      <div>
        <h1 className='sub-heading primary-font'>
          <span style={{ paddingRight: '5px' }}>Transfer</span>
          <span className='has-text-primary'>KAU</span>
        </h1>
        <div style={{ position: 'relative' }}>
          {this.props.isTransferring && <Loader />}
          <div style={this.props.isTransferring ? { filter: 'blur(2px)' } : {}}>
            <InputField
              label='Target Address'
              value={this.props.targetAddress}
              id='transfer-target-address'
              placeholder='Public key to pay'
              onChangeHandler={(newValue) => this.props.updateTransferForm({ field: 'targetAddress', newValue })}
            />
            <p className='label has-text-centered'>OR</p>
            <label className='label is-small'>Select a Payee</label>
            <div className='field is-grouped'>
              <div className='control is-expanded'>
                <div className='select is-fullwidth'>
                  <select
                    className='has-background-dark has-text-grey is-grey'
                    onChange={(ev) => this.props.updateTransferForm({ field: 'targetPayee', newValue: ev.target.value})}
                    value={this.props.targetPayee}
                  >
                    <option value='' hidden={true}>My Payees</option>
                    <option value=''>None</option>
                    {this.payees()}
                  </select>
                </div>
              </div>
              <div className='control'>
                <a className='button' onClick={() => this.props.changeView(View.payees)}>
                  <span className='icon'>
                    <i className='fa fa-plus' />
                  </span>
                  <span>Add Payee</span>
                </a>
              </div>
            </div>
            <InputField
              label='Transfer Amount'
              value={this.props.amount}
              id='transfer-amount'
              placeholder='Amount to transfer'
              onChangeHandler={(newValue) => this.props.updateTransferForm({ field: 'amount', newValue })}
            />
            <InputField
              label='Message'
              value={this.props.memo}
              id='transfer-memo'
              placeholder='Optional message to attach'
              onChangeHandler={(newValue) => this.props.updateTransferForm({ field: 'memo', newValue })}
            />
            <div className='field'>
              <div className='control is-expanded'>
                <button className='button is-fullwidth' onClick={this.initTransfer}>Transfer</button>
              </div>
            </div>
          </div>
        </div>
        <div className='is-divider is-hidden-tablet' style={{ marginBottom: 0, borderTopWidth: '0.01rem' }} />
      </div>
    )
  }
}
