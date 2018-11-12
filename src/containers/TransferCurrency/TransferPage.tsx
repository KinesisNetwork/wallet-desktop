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

import { AmountPresentation } from '@containers/TransferCurrency/AmountPresentation'
import { CurrencyLogo } from '@containers/TransferCurrency/CurrencyLogo'
import { DropdownForm } from '@containers/TransferCurrency/DropdownForm'
import { NewContactTransfer } from '@containers/TransferCurrency/NewContactTransfer'
import { TransferButtons } from '@containers/TransferCurrency/TransferButtons'
import { TransferFormDetails } from '@containers/TransferCurrency/TransferDetails'
import { addMetalColour } from '@helpers/walletUtils'
import { getActiveAccount, getCurrentConnection } from '@selectors'
import { BASE_NETWORK_FEE } from '@services/kinesis'
import { RootState } from '@store'
import { Contact, ImageSize, NotificationType, RootRoutes } from '@types'

const mapStateToProps = ({
  connections,
  transfer: { formData, formMeta },
  contacts: { contactList, newContact },
  accounts,
  wallet,
}: RootState) => ({
  formData,
  formMeta,
  currency: connections.currentCurrency,
  balance: accounts.accountInfo.balance,
  connection: getCurrentConnection(connections).endpoint,
  savedContacts: contactList,
  newContact,
  wallet,
  activeAccount: getActiveAccount(wallet),
})

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
      payee => payee.address === this.props.formData.targetPayee,
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

  handleNewContactChange = (field: keyof Contact, value: string) => {
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
    } = this.props.formMeta.errors
    const hasInputFieldErrors = !!amountError || !!memoError || !!targetPayeeError

    const invalidAmount = this.props.formData.amount === '' || !Number(this.props.formData.amount)

    const hasFormErrors = this.state.isDropdownField
      ? !this.props.formData.targetPayee || this.props.formData.targetPayee === 'Select a contact'
      : !this.props.newContact.address

    return invalidAmount || hasInputFieldErrors || hasFormErrors
  }

  goToConfirmPage = () => {
    if (this.state.saveToContacts && !this.state.isDropdownField) {
      const isMissingField = !this.props.newContact.address || !this.props.newContact.name

      if (
        isMissingField ||
        this.checkForSameContactDetails('address') ||
        this.checkForSameContactDetails('name')
      ) {
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

  checkForSameContactDetails = (contactProperty: keyof Contact) =>
    this.props.savedContacts.find(
      contact => this.props.newContact[contactProperty] === contact[contactProperty],
    )

  componentDidMount() {
    this.props.updateTransferForm({ field: 'amount', newValue: this.props.formData.amount })
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
                size={ImageSize.large}
                title={`Send ${this.props.currency}`}
              />
            </section>
            <AmountPresentation
              amount={this.props.balance}
              text="Available"
              currency={this.props.currency}
            />
            <div className="field">
              {this.state.isDropdownField ? (
                <DropdownForm
                  savedContacts={this.props.savedContacts}
                  onFieldChange={this.handlePayeeFieldToggle}
                  payeePublicKey={this.props.formData.targetPayee}
                  handleChange={handleChange}
                  accounts={this.props.wallet.accounts}
                  activeAccount={this.props.activeAccount}
                />
              ) : (
                <NewContactTransfer
                  errors={this.props.formMeta.errors}
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
                  <p>Network fee</p>
                  <p>Remaining balance</p>
                </div>
                <div
                  className={`column has-text-right content ${addMetalColour(this.props.currency)}`}
                >
                  <p>
                    {(Number(this.props.formData.fee) - BASE_NETWORK_FEE).toFixed(5) || 0}{' '}
                    {this.props.currency}
                  </p>
                  <p>
                    {BASE_NETWORK_FEE.toFixed(5)} {this.props.currency}
                  </p>
                  <p
                    className={`${
                      this.props.formMeta.remainingBalance < 0 ? 'has-text-danger' : ''
                    }`}
                  >
                    {this.props.formMeta.remainingBalance.toFixed(5)} {this.props.currency}
                  </p>
                </div>
              </section>
              <TransferButtons
                cancelText="Cancel"
                nextStepText="Next"
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

const TransferPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransferPagePresentation)

export { TransferPage }
