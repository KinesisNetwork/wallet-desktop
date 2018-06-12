import { InputField } from '@components'
import { formAlert } from '@helpers/alert'
import { InputError } from '@helpers/errors'
import { Payee, WalletView } from '@types'
import { kebabCase, startCase } from 'lodash'
import * as React from 'react'

export interface Props {
  payee: Payee
  setPayee: (payee: Payee) => void
  handleChange: (field: keyof Payee, newValue: string) => any
  currentWalletView: WalletView
  changeTransferView: () => any
}

export class PayeeForm extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  createNewPayee = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    try {
      this.validateProps()
      this.props.setPayee(this.props.payee)
    } catch (e) {
      formAlert(e.message, e.key)
    }
  }

  validateProps = (): void | never => {
    this.checkValidEntry('name')
    this.checkValidEntry('publicKey')
  }

  checkValidEntry = (key: keyof Payee) => {
    if (!this.props.payee[key]) {
      throw new InputError(`${startCase(key)} is required`, `payee-${kebabCase(key)}`)
    }
  }

  renderCancelButton = () => {
    return (
      <div className='control'>
        <button className='button is-danger' type='button' onClick={this.props.changeTransferView}>Back</button>
      </div >
    )
  }

  render() {
    const { payee, handleChange } = this.props
    return (
      <div className='is-centered'>
        <form onSubmit={this.createNewPayee}>
          <InputField
            label='Payee Name'
            value={payee.name}
            id='payee-name'
            helpText='Name your payee'
            onChangeHandler={(newValue) => handleChange('name', newValue)}
          />
          <InputField
            label='Payee Public Key'
            value={payee.publicKey}
            id='payee-public-key'
            helpText='Set the public key of your payee'
            onChangeHandler={(newValue) => handleChange('publicKey', newValue)}
          />
          <div className='field is-grouped'>
            <div className='control is-expanded'>
              <button className='button is-fullwidth' type='submit'>Set Payee</button>
            </div>
            {this.props.currentWalletView !== WalletView.payees && this.renderCancelButton()}
          </div>
        </form>
      </div>
    )
  }
}
