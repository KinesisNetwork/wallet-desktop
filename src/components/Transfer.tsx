import { InputField } from '@components'
import { TransferProps } from '@containers'
import { InputError } from '@helpers/errors'
import { TransferRequest } from '@types'
import { kebabCase, startCase } from 'lodash'
import * as React from 'react'
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
        {/* { this.props.isTransferring && <Loader />} */}
        <h1 className='sub-heading primary-font'>Transfer</h1>
        <div style={{ position: 'relative' }}>
          {this.props.isTransferring && <Loader />}
          <div style={this.props.isTransferring ? { filter: 'blur(2px)' } : {}}>
            <InputField
              label='Target Address'
              value={this.props.targetAddress}
              id='transfer-target-address'
              onChangeHandler={(newValue) => this.props.updateTransferForm({ field: 'targetAddress', newValue })}
            />
            <InputField
              label='Transfer Amount'
              value={this.props.amount}
              id='transfer-amount'
              onChangeHandler={(newValue) => this.props.updateTransferForm({ field: 'amount', newValue })}
            />
            <InputField
              label='Message'
              value={this.props.memo}
              id='transfer-memo'
              onChangeHandler={(newValue) => this.props.updateTransferForm({ field: 'memo', newValue })}
            />
            <div className='field'>
              <div className='control is-expanded'>
                <button className='button is-fullwidth' onClick={this.initTransfer}>Transfer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
