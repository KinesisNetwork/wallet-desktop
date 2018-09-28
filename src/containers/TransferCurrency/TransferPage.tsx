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

import { CurrencyLogo } from '@containers/TransferCurrency/CurrencyLogo'
import { DropdownField } from '@containers/TransferCurrency/DropdownField'
import { NewContactTransfer } from '@containers/TransferCurrency/NewContactTransfer'
import { TransferButtons } from '@containers/TransferCurrency/TransferButtons'
import { TransferFormDetails } from '@containers/TransferCurrency/TransferDetails'
import { addMetalColour } from '@helpers/walletUtils'
import { getCurrentConnection } from '@selectors'
import { RootState } from '@store'
import { NotificationType, RootRoutes } from '@types'

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

export class TransferPagePresentation extends React.Component<Props, State> {
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
    this.setState(
      prevState => ({
        saveToContacts: !prevState.saveToContacts,
      }),
      () => {
        if (!this.state.saveToContacts) {
          this.props.updateContactForm({ field: 'name', newValue: '' })
        }
      },
    )
  }

  handleNewContactChange = (field: 'name' | 'address', value: string) => {
    if (field === 'address') {
      this.props.updateTransferForm({ field: 'targetPayee', newValue: value })
    }

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
        : !this.props.newContact.address
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
            <section className="section has-text-centered">
              <CurrencyLogo
                currency={this.props.currency}
                size="large"
                title={`Send ${this.props.currency}`}
              />
            </section>
            <div className="level">
              <div
                className={`level-item title is-size-3 has-text-weight-semibold ${addMetalColour(
                  this.props.currency,
                )}`}
              >
                {this.props.balance.toFixed(5)} Available
              </div>
            </div>
            <div className="field">
              {this.state.isDropdownField ? (
                <DropdownField
                  savedContacts={this.props.savedContacts}
                  onFieldChange={this.handlePayeeFieldToggle}
                  payeePublicKey={this.props.targetPayee}
                  handleChange={handleChange}
                />
              ) : (
                <NewContactTransfer
                  errors={this.props.errors}
                  handleChange={this.handleNewContactChange}
                  onFieldChange={this.handlePayeeFieldToggle}
                  onSaveToContactsChange={this.handleSaveToContact}
                  saveToContacts={this.state.saveToContacts}
                  name={this.props.newContact.name}
                  publicKey={this.props.newContact.address}
                />
              )}
              <TransferFormDetails />
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
              <TransferButtons
                cancelText="Cancel"
                nextStepText="Send"
                cancelButtonClick={this.props.goBackToDashboard}
                nextStepButtonClick={this.goToConfirmPage}
                isDisabled={this.hasFieldErrors()}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const ConnectedTransferPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransferPagePresentation)

export { ConnectedTransferPage as TransferPage }
