import { kebabCase, startCase } from 'lodash'
import * as React from 'react'

import { InputField } from '@components/InputField'
import { InputError } from '@helpers/errors'
import { FormAlert, Payee, WalletView } from '@types'

export interface Props {
  payee: Payee
  addPayee: (payee: Payee) => any
  handleChange: (field: keyof Payee, newValue: string) => any
  activeWalletView: WalletView
  cancelForm: () => any
  formIsInvalid: (formAlertArgs: FormAlert) => any
}

export class PayeeForm extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  createNewPayee = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    try {
      this.validateProps()
      this.props.addPayee(this.props.payee)
    } catch (e) {
      this.props.formIsInvalid({
        message: e.message,
        key: e.key
      })
    }
  }

  validateProps = (): void | never => {
    this.checkValidEntry('name')
    this.checkValidEntry('publicKey')
  }

  checkValidEntry = (key: keyof Payee) => {
    if (!this.props.payee[key]) {
      throw new InputError(`${startCase(key)} is required`, `input-payee-${kebabCase(key)}`)
    }
  }

  renderCancelButton = () => {
    return (
      <div className='control'>
        <button className='button is-danger' type='button' onClick={this.props.cancelForm}>Back</button>
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
            {this.props.activeWalletView !== WalletView.payees && this.renderCancelButton()}
          </div>
        </form>
      </div>
    )
  }
}
