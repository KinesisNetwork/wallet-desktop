import { InputField } from '@components'
import { formAlert } from '@helpers/alert'
import { InputError } from '@helpers/errors'
import { Payee } from '@types'
import { kebabCase, startCase } from 'lodash'
import * as React from 'react'

export interface Props {
  payee: Payee
  setPayee: (payee: Payee) => void
  handleChange: (field: keyof Payee, newValue: string) => any
}

export const PayeeSet: React.SFC<Props> = (props) => (
  <div className='vertical-spaced has-text-centered'>
    <h1 className='title-heading'>ADD A NEW PAYEE</h1>
    <section className='section'>
      <PayeeForm {...props} />
    </section>
  </div>
)

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
          </div>
        </form>
      </div>
    )
  }
}
