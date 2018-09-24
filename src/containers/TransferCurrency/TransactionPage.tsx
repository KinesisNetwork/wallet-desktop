import { goBack, push } from 'connected-react-router'
import * as React from 'react'
import { connect } from 'react-redux'

import {
  addPayee,
  insufficientFunds,
  updateRemainingBalance,
  updateTransferForm
} from '@actions'

import * as kagLogo from '@icons/kag-icon.svg'
import * as kauLogo from '@icons/kau-icon.svg'

import { InputField } from '@components/InputField'
import { DropdownField } from '@containers/TransferCurrency/DropdownField';
import { FilloutField } from '@containers/TransferCurrency/FilloutField';
import { addMetalColour } from '@helpers/walletUtils'
import { getCurrentConnection } from '@selectors'
import { RootState } from '@store'
import { Currency, RootRoutes } from '@types'

const mapStateToProps = (state: RootState) => {
  const { connections, transfer, payees } = state

  return {
    ...transfer.formData,
    ...transfer.formMeta,
    currency: state.connections.currentCurrency,
    balance: state.accounts.accountInfo.balance,
    connection: getCurrentConnection(connections).endpoint,
    savedContacts: payees.payeesList,
  }
}

const mapDispatchToProps = {
  goBackToDashboard: () => goBack(),
  goToConfirm: () => push(RootRoutes.dashboard + '/confirm'),
  updateTransferForm,
  insufficientFunds,
  updateRemainingBalance,
  addPayee,
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

interface State {
  isDropdownField: boolean
  saveToContacts: boolean
  newContact: {
    name: string
    publicKey: string
  }
}

export class TransactionPagePresentation extends React.Component<Props, State> {
  state = {
    isDropdownField: true,
    saveToContacts: true,
    addressInStore: this.props.savedContacts.find(payee => payee.publicKey === this.props.payeePublicKey),
    newContact: { name: '', publicKey: ''}
  }

  handlePayeeFieldToggle = () => {
    this.setState(prevState => ({ isDropdownField: !prevState.isDropdownField }), () => {
      this.props.updateTransferForm({ field: 'payeePublicKey', newValue: '' })
    })
  }

  handleSaveToContact = () => {
    this.setState(prevState => ({
      saveToContacts: !prevState.saveToContacts,
      newContact: {
        ...this.state.newContact,
        name: prevState.saveToContacts ? '' : this.state.newContact.name,
      }
    }))
  }

  // TODO: This form can and likely should live in the store
  handleNewContactChange = (field: 'name' | 'publicKey', value: string) => {
    this.setState({
      newContact: {
        ...this.state.newContact,
        [field]: value
      }
    }, () => {
      this.props.updateTransferForm({ field: 'payeePublicKey', newValue: this.state.newContact.publicKey })
    })

  }

  hasFieldErrors() {
    const {
      amount: amountError,
      memo: memoError,
      payeePublicKey: payeePublicKeyError,
    } = this.props.errors
    return this.props.amount === '' || !!amountError || !!memoError || !!payeePublicKeyError
  }

  goToConfirmPage = () => {
    if (this.state.saveToContacts && !this.state.isDropdownField) {
      const isMissingField = !this.state.newContact.publicKey || !this.state.newContact.name

      const hasTheSamePublicAddress = this.props.savedContacts
        .findIndex(({ publicKey }) => this.state.newContact.publicKey === publicKey) !== -1

      const hasTheSameName = this.props.savedContacts
        .findIndex(({ name }) => this.state.newContact.name === name) !== -1

      if (isMissingField || hasTheSamePublicAddress || hasTheSameName) {
        // TODO: Hande error
        return
      }

      this.props.addPayee(this.state.newContact)
    }

    this.props.goToConfirm()
  }

  componentDidMount() {
    this.props.updateRemainingBalance(this.props.balance)
    this.props.insufficientFunds(false)
  }

  render() {
    const { updateTransferForm: handleChange } = this.props
    return (
      <React.Fragment>
        <div className="columns is-mobile is-centered">
          <div className="column is-one-third">
            <section className="section has-text-centered" style={{ letterSpacing: '3px' }}>
              <div className="level">
                <div className="level-item">
                  <figure className="image is-128x128">
                    <img src={this.props.currency === Currency.KAU ? kauLogo : kagLogo} className="is-rounded" />
                  </figure>
                </div>
              </div>
              <div className="level">
                <div className="level-item">
                  <h1 className={`title is-size-4 has-text-grey-lighter has-text-weight-bold is-uppercase`}>
                    Send {this.props.currency}
                  </h1>
                </div>
              </div>
              <div className="level">
                <div className={`level-item title is-size-3 has-text-weight-semibold ${
                  addMetalColour(this.props.currency)
                  }`}>
                  {this.props.balance.toFixed(5)} Available
              </div>
              </div>
            </section>
            <div className="field">
              {this.state.isDropdownField
                ? <DropdownField
                  savedContacts={this.props.savedContacts}
                  onFieldChange={this.handlePayeeFieldToggle}
                  payeePublicKey={this.props.payeePublicKey}
                  handleChange={handleChange}
                />
                : <FilloutField
                  errors={this.props.errors}
                  handleChange={this.handleNewContactChange}
                  onFieldChange={this.handlePayeeFieldToggle}
                  onSaveToContactsChange={this.handleSaveToContact}
                  saveToContacts={this.state.saveToContacts}
                  name={this.state.newContact.name}
                  publicKey={this.state.newContact.publicKey}
                />
              }
              <InputField
                id='transfer-amount'
                value={this.props.amount}
                placeholder={`0 ${this.props.currency}`}
                onChangeHandler={newValue => handleChange({ field: 'amount', newValue })}
                label='Amount'
                errorText={this.props.errors.amount}
              />
              <InputField
                id='transfer-description'
                value={this.props.memo}
                onChangeHandler={newValue => handleChange({ field: 'memo', newValue })}
                label='Description'
                placeholder='Optional'
                helpText={`${this.props.memo.length || 0} / 25`}
                errorText={this.props.errors.memo}
              />
              <section className="columns">
                <div className="column content has-text-grey-lighter">
                  <p>Transaction fee</p>
                  <p>Remaining balance</p>
                </div>
                <div className={`column has-text-right content ${addMetalColour(this.props.currency)}`}>
                  <p>{Number(this.props.fee).toFixed(5) || 0} {this.props.currency}</p>
                  <p className={`${this.props.remainingBalance < 0 ? 'has-text-danger' : ''}`}>{this.props.remainingBalance.toFixed(5)} {this.props.currency}</p>
                </div>
              </section>
              <section className="field is-grouped is-grouped-right">
                <p className="control">
                  <button
                    className="button is-text"
                    onClick={this.props.goBackToDashboard}>Cancel</button>
                </p>
                <p className="control">
                  <button
                    className="button is-primary"
                    disabled={this.hasFieldErrors()}
                    onClick={this.goToConfirmPage}
                  >
                    <span className="icon"><i className="fal fa-arrow-up" /></span>
                    <span>Send</span>
                  </button>
                </p>
              </section>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const ConnectedTransactionPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionPagePresentation)

export { ConnectedTransactionPage as TransactionPage }
