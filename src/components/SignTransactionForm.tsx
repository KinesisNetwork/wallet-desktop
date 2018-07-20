import * as React from 'react'

import { InputField } from '@components'
import { SignTransactionFormProps } from '@containers'
import { getServer } from '@services/kinesis'
import * as copy from 'copy-to-clipboard'
import { Keypair, Transaction } from 'js-kinesis-sdk'

interface State {
  transaction: Transaction | null,
}
export class SignTransactionForm extends React.Component<SignTransactionFormProps, State> {
  constructor(props) {
    super(props)
    this.state = {
      transaction: null,
    }
  }

  submitTransaction = () => {
    if (this.state.transaction) {
      const server = getServer(this.props.connection)
      return server.submitTransaction(this.state.transaction)
    }
  }

  signTransaction: React.FormEventHandler<HTMLElement> = (ev) => {
    ev.preventDefault()
    const transaction = new Transaction(this.props.message)
    const keypair = Keypair.fromSecret(this.props.decryptedPrivateKey())
    transaction.sign(keypair)
    this.setState({ transaction })
    copy(transaction.toEnvelope().toXDR().toString('base64'))
    // tslint:disable-next-line:no-console
    console.log(transaction)
  }

  renderTransaction = () => {
    if (this.state.transaction) {
      const stringValue = this.state.transaction.toEnvelope().toXDR().toString('base64')
      return (
        <React.Fragment>
          <div className='field'>
            <div className='control'>
              <textarea className='textarea' value={stringValue} readOnly={true} />
            </div>
          </div>
          <div className='field'>
            <div className='control'>
              <button className='button is-fullwidth' onClick={this.submitTransaction}>
                Submit
            </button>
            </div>
          </div>
        </React.Fragment>
      )
    }
  }

  render() {
    return (
      <form onSubmit={this.signTransaction}>
        <InputField
          label='Transaction'
          value={this.props.message}
          id='signdata-message'
          helpText='Enter the text to sign'
          onChangeHandler={(newValue) => this.props.updateSignTransactionForm({ field: 'message', newValue })}
        />
        <div className='field is-grouped'>
          <div className='control is-expanded'>
            <button className='button is-fullwidth' type='submit'>Sign</button>
          </div>
        </div>
        {this.renderTransaction()}
      </form>
    )
  }
}
