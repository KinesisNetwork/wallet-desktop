import { goBack, push } from 'connected-react-router'
import * as React from 'react'
import { connect } from 'react-redux'

import {
  addContact,
  insufficientFunds,
  showNotification,
  updateContactForm,
  updateRemainingBalance,
  updateTransferForm,
} from '@actions'

import * as kagLogo from '@icons/kag-icon.svg'
import * as kauLogo from '@icons/kau-icon.svg'

import { InputField } from '@components/InputField'
import { DropdownField } from '@containers/TransferCurrency/DropdownField'
import { FilloutField } from '@containers/TransferCurrency/FilloutField'
import { addMetalColour } from '@helpers/walletUtils'
import { getCurrentConnection } from '@selectors'
import { RootState } from '@store'
import { Currency, NotificationType, RootRoutes } from '@types'

const mapStateToProps = (state: RootState) => {
  const { connections, transfer, contacts } = state

  return {
    ...transfer.formData,
    ...transfer.formMeta,
    currency: state.connections.currentCurrency,
    balance: state.accounts.accountInfo.balance,
    connection: getCurrentConnection(connections).endpoint,
    savedContacts: contacts.contactList,
    newContact: contacts.newContact,
  }
}

const mapDispatchToProps = {
  goBackToDashboard: () => goBack(),
  goToConfirm: () => push(RootRoutes.dashboard + '/confirm'),
  updateTransferForm,
  insufficientFunds,
  updateRemainingBalance,
  addContact,
  showNotification,
  updateContactForm,
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

interface State {
  isDropdownField: boolean
  saveToContacts: boolean
}

export class TransactionPagePresentation extends React.Component<Props, State> {
  state = {
    isDropdownField: true,
    saveToContacts: true,
    addressInStore: this.props.savedContacts.find(
      payee => payee.address === this.props.targetPayee,
    ),
  }

  handlePayeeFieldToggle = () => {
    this.setState(
      prevState => ({ isDropdownField: !prevState.isDropdownField }),
      () => {
        this.props.updateTransferForm({ field: 'targetPayee', newValue: '' })
      },
    )
  }

  handleSaveToContact = () => {
    this.setState(prevState => ({
      saveToContacts: !prevState.saveToContacts,
    }))
  }

  handleNewContactChange = (field: 'name' | 'address', value: string) => {
    this.props.updateTransferForm({ field: 'targetPayee', newValue: value })
    this.props.updateContactForm({
      field,
      newValue: value,
    })
  }

  hasFieldErrors() {
    const {
      amount: amountError,
      memo: memoError,
      targetPayee: targetPayeeError,
    } = this.props.errors
    const invalidAmount = this.props.amount === '' || !Number(this.props.amount)
    const hasInputFieldErrors = () => {
      return this.state.isDropdownField
        ? !this.props.targetPayee || this.props.targetPayee === 'Select a contact'
        : !this.props.newContact.name || !this.props.newContact.address
    }

    return (
      invalidAmount || !!amountError || !!memoError || !!targetPayeeError || hasInputFieldErrors()
    )
  }

  goToConfirmPage = () => {
    if (this.state.saveToContacts && !this.state.isDropdownField) {
      const isMissingField = !this.props.newContact.address || !this.props.newContact.name

      const hasTheSamePublicAddress =
        this.props.savedContacts.findIndex(
          ({ address }) => this.props.newContact.address === address,
        ) !== -1

      const hasTheSameName =
        this.props.savedContacts.findIndex(({ name }) => this.props.newContact.name === name) !== -1

      if (isMissingField || hasTheSamePublicAddress || hasTheSameName) {
        this.props.showNotification({
          type: NotificationType.error,
          message: 'An error occured while completing the form.',
        })
        return
      }

      this.props.addContact(this.props.newContact)
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
                    <img
                      src={this.props.currency === Currency.KAU ? kauLogo : kagLogo}
                      className="is-rounded"
                    />
                  </figure>
                </div>
              </div>
              <div className="level">
                <div className="level-item">
                  <h1
                    className={`title is-size-4 has-text-grey-lighter has-text-weight-bold is-uppercase`}
                  >
                    Send {this.props.currency}
                  </h1>
                </div>
              </div>
              <div className="level">
                <div
                  className={`level-item title is-size-3 has-text-weight-semibold ${addMetalColour(
                    this.props.currency,
                  )}`}
                >
                  {this.props.balance.toFixed(5)} Available
                </div>
              </div>
            </section>
            <div className="field">
              {this.state.isDropdownField ? (
                <DropdownField
                  savedContacts={this.props.savedContacts}
                  onFieldChange={this.handlePayeeFieldToggle}
                  payeePublicKey={this.props.targetPayee}
                  handleChange={handleChange}
                />
              ) : (
                <FilloutField
                  errors={this.props.errors}
                  handleChange={this.handleNewContactChange}
                  onFieldChange={this.handlePayeeFieldToggle}
                  onSaveToContactsChange={this.handleSaveToContact}
                  saveToContacts={this.state.saveToContacts}
                  name={this.props.newContact.name}
                  publicKey={this.props.newContact.address}
                />
              )}
              <InputField
                id="transfer-amount"
                value={this.props.amount}
                placeholder={`0 ${this.props.currency}`}
                onChangeHandler={newValue => handleChange({ field: 'amount', newValue })}
                label="Amount"
                errorText={this.props.errors.amount}
              />
              <InputField
                id="transfer-description"
                value={this.props.memo}
                onChangeHandler={newValue => handleChange({ field: 'memo', newValue })}
                label="Description"
                placeholder="Optional"
                helpText={`${this.props.memo.length || 0} / 25`}
                errorText={this.props.errors.memo}
              />
              <section className="columns">
                <div className="column content has-text-grey-lighter">
                  <p>Transaction fee</p>
                  <p>Remaining balance</p>
                </div>
                <div
                  className={`column has-text-right content ${addMetalColour(this.props.currency)}`}
                >
                  <p>
                    {Number(this.props.fee).toFixed(5) || 0} {this.props.currency}
                  </p>
                  <p className={`${this.props.remainingBalance < 0 ? 'has-text-danger' : ''}`}>
                    {this.props.remainingBalance.toFixed(5)} {this.props.currency}
                  </p>
                </div>
              </section>
              <section className="field is-grouped is-grouped-right">
                <p className="control">
                  <button className="button is-text" onClick={this.props.goBackToDashboard}>
                    Cancel
                  </button>
                </p>
                <p className="control">
                  <button
                    className="button is-primary"
                    disabled={this.hasFieldErrors()}
                    onClick={this.goToConfirmPage}
                  >
                    <span className="icon">
                      <i className="fal fa-arrow-up" />
                    </span>
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
  mapDispatchToProps,
)(TransactionPagePresentation)

export { ConnectedTransactionPage as TransactionPage }
