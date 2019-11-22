import { goBack, push } from 'connected-react-router'
import * as React from 'react'
import { connect } from 'react-redux'

import { addContact, showNotification, updateContactForm, updateTransferForm } from '@actions'

import { AmountPresentation } from '@containers/TransferCurrency/AmountPresentation'
import { CurrencyLogo } from '@containers/TransferCurrency/CurrencyLogo'
import { DropdownForm } from '@containers/TransferCurrency/DropdownForm'
import { NewContactTransfer } from '@containers/TransferCurrency/NewContactTransfer'
import { TransferButtons } from '@containers/TransferCurrency/TransferButtons'
import { TransferFormDetails } from '@containers/TransferCurrency/TransferDetails'
import { addMetalColour } from '@helpers/walletUtils'
import { getActiveAccount, getCurrentConnection } from '@selectors'
import { BASE_NETWORK_FEE } from '@services/kinesis'
import { renderAmountToDpWithoutRounding } from '@services/util'
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
        this.props.updateContactForm({ field: 'address', newValue: '' })
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
      formMeta: {
        errors: { memo: memoError, targetPayee: targetPayeeError },
        minimumBalance,
        remainingBalance,
      },
      formData: { amount: amountToTransfer, targetPayee },
      newContact: { address },
    } = this.props

    const hasInputFieldErrors = !!memoError || !!targetPayeeError

    const invalidAmount = amountToTransfer === '' || !Number(amountToTransfer)

    const hasInsufficientFundsToInitiateTransfer = remainingBalance < minimumBalance

    const noTargetPayeeSelected = !targetPayee || targetPayee === 'Select a contact'

    const hasFormErrors = this.state.isDropdownField ? noTargetPayeeSelected : !address

    return (
      invalidAmount ||
      hasInputFieldErrors ||
      hasFormErrors ||
      hasInsufficientFundsToInitiateTransfer
    )
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

  get sufficientBalanceClass() {
    const { minimumBalance, remainingBalance } = this.props.formMeta

    return remainingBalance < minimumBalance ? 'has-text-danger' : ''
  }

  render() {
    const {
      activeAccount,
      balance,
      currency,
      formData: { fee, targetPayee },
      formMeta: { errors, remainingBalance },
      goBackToDashboard,
      newContact,
      savedContacts,
      updateTransferForm: handleChange,
      wallet: { accounts: walletAccounts },
    } = this.props

    const transactionFee = Number(fee) - BASE_NETWORK_FEE

    return (
      <div className="columns is-mobile is-centered">
        <div className="column is-one-third">
          <section className="section has-text-centered">
            <CurrencyLogo currency={currency} size={ImageSize.large} title={`Send ${currency}`} />
          </section>
          <AmountPresentation amount={balance} text="Available" currency={currency} />
          <div className="field">
            {this.state.isDropdownField ? (
              <DropdownForm
                savedContacts={savedContacts}
                onFieldChange={this.handlePayeeFieldToggle}
                payeePublicKey={targetPayee}
                handleChange={handleChange}
                accounts={walletAccounts}
                activeAccount={activeAccount}
              />
            ) : (
              <NewContactTransfer
                errors={errors}
                handleChange={this.handleNewContactChange}
                onFieldChange={this.handlePayeeFieldToggle}
                onSaveToContactsChange={this.handleSaveToContact}
                saveToContacts={this.state.saveToContacts}
                name={newContact.name}
                publicKey={newContact.address}
              />
            )}
            <TransferFormDetails />
            <section className="columns">
              <div className="column content has-text-grey-lighter">
                <p>Transaction fee</p>
                <p>Network fee</p>
                <p>Remaining balance</p>
              </div>
              <div className={`column has-text-right content ${addMetalColour(currency)}`}>
                <p>
                  {renderAmountToDpWithoutRounding(transactionFee, 5)} {currency}
                </p>
                <p>
                  {renderAmountToDpWithoutRounding(BASE_NETWORK_FEE, 5)} {currency}
                </p>
                <p className={this.sufficientBalanceClass}>
                  {renderAmountToDpWithoutRounding(remainingBalance, 5)} {currency}
                </p>
              </div>
            </section>
            <TransferButtons
              cancelText="Cancel"
              nextStepText="Next"
              cancelButtonClick={goBackToDashboard}
              nextStepButtonClick={this.goToConfirmPage}
              isDisabled={this.hasFieldErrors()}
            />
          </div>
        </div>
      </div>
    )
  }
}

const TransferPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransferPagePresentation)

export { TransferPage }
