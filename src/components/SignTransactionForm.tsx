import * as React from 'react'

import { InputField } from '@components'
import { SignTransactionFormProps } from '@containers'
import * as copy from 'copy-to-clipboard'
import { Keypair, Transaction } from 'js-kinesis-sdk'

interface State {
  transaction?: Transaction
  signed: boolean
}
export class SignTransactionForm extends React.Component<SignTransactionFormProps, State> {
  state: State = {
    signed: false,
  }

  componentDidUpdate(prevProps: SignTransactionFormProps) {
    if (prevProps.message !== this.props.message) {
      this.setState({ signed: false, transaction: undefined })
    }
  }

  submitTransaction = () =>
    this.state.transaction && this.props.transactionRequest(this.state.transaction)

  generateTransaction = () => this.setState({ transaction: new Transaction(this.props.message) })

  signTransaction = () => {
    if (this.state.transaction) {
      const keypair = Keypair.fromSecret(this.props.decryptedPrivateKey())
      this.state.transaction.sign(keypair)
      this.setState({ signed: true })
      copy(
        this.state.transaction
          .toEnvelope()
          .toXDR()
          .toString('base64'),
      )
    }
  }

  render() {
    return (
      <div className="columns is-centered">
        <div className="column">
          <InputField
            label="Transaction"
            value={this.props.message}
            id="signdata-message"
            helpText="Paste the serialized transaction here"
            onChangeHandler={newValue =>
              this.props.updateSignTransactionForm({
                field: 'message',
                newValue,
              })
            }
          />
          <div className="field is-grouped">
            <div className="control is-expanded">
              <button className="button is-fullwidth" onClick={this.generateTransaction}>
                Load
              </button>
            </div>
            <div className="control is-expanded">
              <button
                className="button is-fullwidth"
                onClick={this.signTransaction}
                disabled={!this.state.transaction}
              >
                Sign
              </button>
            </div>
            <div className="control is-expanded">
              <button
                className="button is-fullwidth"
                onClick={this.submitTransaction}
                disabled={!this.state.signed}
              >
                Submit to Network
              </button>
            </div>
          </div>
        </div>
        {/* <div className='column'>{this.renderTransaction()}</div> */}
      </div>
    )
  }
}
