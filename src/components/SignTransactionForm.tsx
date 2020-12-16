import * as copy from 'copy-to-clipboard'
import { Keypair, Transaction, TransactionOperation } from 'js-kinesis-sdk'
import { startCase } from 'lodash'
import * as React from 'react'

import { SignTransactionFormProps } from '@containers/SignTransactionForm'
import { getTransactionSigners } from '@services/accounts'
import { convertStroopsToKinesis, getServer } from '@services/kinesis'
import { Connection, Contact, Currency } from '@types'
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
            currency={this.props.currency}
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
  currency: Currency
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

  findNameForAddress = (address: string): string => {
    const foundContact = this.props.addressInBook.find(contact => contact.address === address)
    return foundContact ? foundContact.name : address
  }

  renderOperations = () =>
    this.props.transaction.operations.map(op => (
      <OperationOverview
        currency={this.props.currency}
        findNameForAddress={this.findNameForAddress}
        key={op.type}
        operation={op}
      />
    ))

  renderSigners = () =>
    this.state.signers.map(sig => (
      <HorizontalLabelledField key={sig} value={this.findNameForAddress(sig)} label="" />
    ))

  render() {
    const { currency, transaction } = this.props
    return (
      <div className="section">
        <h3 className="subtitle">Transaction</h3>
        <HorizontalLabelledField
          label="Source"
          value={this.findNameForAddress(transaction.source)}
        />
        <HorizontalLabelledField
          label="Fee"
          value={`${convertStroopsToKinesis(transaction.fee)} ${currency}`}
        />
        {this.renderOperations()}
        <hr />
        <h3 className="subtitle">Signers</h3>
        {this.renderSigners()}
      </div>
    )
  }
}

interface OperationProps {
  currency: Currency
  operation: TransactionOperation
  findNameForAddress(address: string): string
}
class OperationOverview extends React.Component<OperationProps> {
  renderAddress = (address: string) => this.props.findNameForAddress(address)

  renderAmount = (amount: number | string) => `${amount} ${this.props.currency}`

  renderValue = (key: string, value: number | string) =>
    ['destination', 'source'].includes(key)
      ? this.renderAddress(value as string)
      : ['amount', 'startingBalance'].includes(key)
        ? this.renderAmount(value)
        : value

  renderOperationRecords = () =>
    Object.entries(this.props.operation)
      .filter(([key, value]) => key !== 'type' && ['string', 'number'].includes(typeof value))
      .map(([key, value]) => (
        <HorizontalLabelledField
          label={startCase(key)}
          value={this.renderValue(key, value) as string}
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
