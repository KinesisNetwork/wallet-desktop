import * as React from 'react'
import { TransferRequest, FormUpdate } from '@types';
import { InputError } from '@helpers/errors';
import { startCase, kebabCase } from 'lodash';
import { InputField } from '@components';
import { Loader } from './Loader';

export interface Props extends TransferRequest {
  transferRequest: (req: TransferRequest) => any
  updateTransferForm: (update: FormUpdate<TransferRequest>) => any
  isTransferring: boolean
  transferError?: Error
}

export class Transfer extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  initTransfer = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault()
    try {
      this.validateProps()
      this.props.transferRequest(this.props)
    } catch (e) {
      if (e instanceof InputError) {
        e.alert()
      }
    }
  }

  validateProps = () => {
    this.checkValidEntry('targetAddress')
    this.checkValidEntry('amount')
    this.checkValidMemo()
  }

  checkValidEntry = (name: keyof TransferRequest) => {
    if (!this.props[name]) {
      throw new InputError(`${startCase(name)} is required`, `transfer-${kebabCase(name)}`)
    }
  }

  checkValidMemo = () => {
    if (this.props.memo.length > 24) {
      throw new InputError('Memo must be fewer than 25 characters', 'transfer-memo')
    }
  }

  render() {
    return (
      <div>
        { this.props.isTransferring && <Loader />}
        <h1 className='sub-heading primary-font'>Transfer</h1>
        <InputField label='Target Address' value={this.props.targetAddress} id='transfer-target-address'
          onChangeHandler={(newValue) => this.props.updateTransferForm({field: 'targetAddress', newValue})} />
        <InputField label='Transfer Amount' value={this.props.amount} id='transfer-amount'
          onChangeHandler={(newValue) => this.props.updateTransferForm({field: 'amount', newValue})} />
        <InputField label='Message' value={this.props.memo} id='transfer-memo'
          onChangeHandler={(newValue) => this.props.updateTransferForm({field: 'memo', newValue})} />
        <div className='field'>
          <div className='control is-expanded'>
            <button className='button is-fullwidth' onClick={this.initTransfer}>Transfer</button>
          </div>
        </div>
      </div>
    )
  }
}
