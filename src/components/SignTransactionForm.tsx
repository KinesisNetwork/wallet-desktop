import * as copy from 'copy-to-clipboard'
import { Keypair, Transaction, TransactionOperation } from 'js-kinesis-sdk'
import { startCase } from 'lodash'
import * as React from 'react'

import { SignTransactionFormProps } from '@containers/SignTransactionForm'
import { getTransactionSigners } from '@services/accounts'
import { getServer } from '@services/kinesis'
import { Connection, Contact } from '@types'
import { InputField } from './InputField'
import { HorizontalLabelledField } from './LabelledField'

interface State {
  transaction?: Transaction
  signed: boolean
  copied: boolean
}
export class SignTransactionForm extends React.Component<SignTransactionFormProps, State> {
  state: State = {
    signed: false,
    copied: false,
  }

  componentDidUpdate(prevProps: SignTransactionFormProps) {
    if (prevProps.message !== this.props.message) {
      this.setState({ signed: false, transaction: undefined })
    }
  }

  submitTransaction = () =>
    this.state.transaction && this.props.transactionRequest(this.state.transaction)

  loadTransaction = () => this.setState({ transaction: new Transaction(this.props.message) })

  signTransaction = () => {
    if (this.state.transaction) {
      const keypair = Keypair.fromSecret(this.props.decryptedPrivateKey())
      this.state.transaction.sign(keypair)
      this.setState({ signed: true })
    }
  }

  copyTransaction = () => {
    if (this.state.transaction && !this.state.copied) {
      copy(
        this.state.transaction
          .toEnvelope()
          .toXDR()
          .toString('base64'),
      )
      this.setState({ copied: true })
      setTimeout(() => this.setState({ copied: false }), 2000)
    }
  }

  render() {
    return (
      <div>
        <div>
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
              <button className="button is-fullwidth" onClick={this.loadTransaction}>
                Load
              </button>
            </div>
            <div className="control is-expanded">
              <button
                className="button is-fullwidth"
                onClick={this.signTransaction}
                disabled={!this.state.transaction || this.state.signed}
              >
                Sign
              </button>
            </div>
            <div className="control is-expanded">
              <button
                className="button is-fullwidth"
                onClick={this.copyTransaction}
                disabled={!this.state.transaction || !this.state.signed}
              >
                {this.state.copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="control is-expanded">
              <button
                className={`button is-fullwidth ${
                  this.props.submissionPending ? 'is-loading' : ''
                }`}
                onClick={this.submitTransaction}
                disabled={!this.state.signed || this.props.submissionPending}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        {this.state.transaction && (
          <TransactionView
            transaction={this.state.transaction}
            connection={this.props.connection}
            didSign={this.state.signed}
            addressInBook={this.props.addressInBook}
          />
        )}
      </div>
    )
  }
}

interface Props {
  transaction: Transaction
  connection: Connection
  didSign: boolean
  addressInBook: Contact[]
}
interface TransactionState {
  signers: string[]
}
class TransactionView extends React.Component<Props, TransactionState> {
  state: TransactionState = { signers: [] }

  getSigners = async () => {
    const signers = await getTransactionSigners(
      getServer(this.props.connection),
      this.props.transaction,
    )
    this.setState({ signers: signers.map(sig => sig.publicKey()) })
  }

  componentDidMount() {
    this.getSigners()
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.didSign !== this.props.didSign) {
      this.getSigners()
    }
  }

  renderOperations = () =>
    this.props.transaction.operations.map(op => (
      <OperationOverview operation={op} key={op.type} getNameForAddress={this.getNameForAddress} />
    ))

  renderSigners = () =>
    this.state.signers.map(sig => (
      <HorizontalLabelledField key={sig} value={this.getNameForAddress(sig)} label="" />
    ))

  getNameForAddress = (address: string): string => {
    const foundContact = this.props.addressInBook.find(contact => contact.address === address)
    return foundContact ? foundContact.name : address
  }

  render() {
    const { transaction } = this.props
    return (
      <div className="section">
        <h3 className="subtitle">Transaction</h3>
        <HorizontalLabelledField
          label="Source"
          value={this.getNameForAddress(transaction.source)}
        />
        <HorizontalLabelledField label="Fee" value={transaction.fee.toString()} />
        {this.renderOperations()}
        <hr />
        <h3 className="subtitle">Signers</h3>
        {this.renderSigners()}
      </div>
    )
  }
}

class OperationOverview extends React.Component<{
  operation: TransactionOperation
  getNameForAddress: (address: string) => string
}> {
  renderOperationRecords = () =>
    Object.entries(this.props.operation)
      .filter(([key, value]) => key !== 'type' && ['string', 'number'].includes(typeof value))
      .map(([key, value]) => (
        <HorizontalLabelledField
          label={startCase(key)}
          value={key === 'destination' ? this.props.getNameForAddress(value) : value}
          key={key}
        />
      ))

  render() {
    const { operation } = this.props
    return (
      <React.Fragment>
        <hr />
        <h3 className="subtitle">{startCase(operation.type)}</h3>
        {this.renderOperationRecords()}
      </React.Fragment>
    )
  }
}
