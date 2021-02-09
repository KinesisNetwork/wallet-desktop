import { goBack, push } from 'connected-react-router'
import * as React from 'react'
import { connect } from 'react-redux'

import {
  addContact,
  showNotification,
  updateContactForm,
  updateTransferForm,
  updateTransferFormComplete,
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
import { renderAmountToDpWithoutRounding } from '@services/util'
import { RootState } from '@store'
import { ConnectionStage, Contact, ImageSize, NotificationType, RootRoutes } from '@types'

const mapStateToProps = ({
  connections,
  transfer: { formData, formMeta, formDataLoading },
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
  calculatingInProgress: formDataLoading,
  isTestnet: connections.currentStage === ConnectionStage.testnet,
})

const mapDispatchToProps = {
  goBackToDashboard: () => goBack(),
  goToConfirm: () => push(RootRoutes.dashboard + '/confirm'),
  updateTransferForm,
  addContact,
  showNotification,
  updateContactForm,
  updateTransferFormComplete,
}

const mnetWhiteListedAccount = [
  'GA6BP5AHBADCCHIE7FCIARHH64IQZIZMNKCQWPIMROMYIPWYO7VTUDMQ',
  'GAFUJGZWMGWVZJ4PUVHQM54GDBPN7Q5FJQ7GEQ35AW5QPSRX74UHTPXS',
  'GBIHU73FWFDKGZY2XIHZNPO4RBAIHEV433C55XIHC34IYLUGPRY2G4P5',
  'GD5CMVRI42SUHBRWHX4EPXYGPBJTYU4XB36XSNPMRHYEFBP2WS5LFQAO',
  'GAKQ4BXFLMB5LQ6IQZXMU4PRHPAQH6MLZNLOH2DUYE7X3TRQYUK2QFYW',
]
const tnetWhiteListedAccount = [
  'GC5Z3MPAZFZGGCGSACYTXQO4RFMNKBEDPULU5XD6ZVRRCWA5C3NVJ3VP',
  'GBAVVI7NQXNH4PVNWZJCIJPF4C7PPFSMLWB4UZEZDQZQYX52E56AYV35',
  'GDHCV4C5P2ZCHDFKOHNMAWBK2BPMOJCXQK4QZ74NU2JCPSJRHTZ2SDAN',
  'GAPZHHMWDW3X6PPKUVB4MQHC5HVZLAAPIL27E3R3NISK7ITINHENAXHO',
  'GACMG3VV2XINSQYR2DZ2HRWCQBL274UHTNCDKT5R7XWUOELQM2CHUVM6',
]

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
        errors: { memo: memoError, targetPayee: targetPayeeError, amount: amountErrors },
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

    const hasAmountErrors = amountErrors !== ''

    return (
      invalidAmount ||
      hasInputFieldErrors ||
      hasFormErrors ||
      hasInsufficientFundsToInitiateTransfer ||
      hasAmountErrors
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

  componentWillMount() {
    this.props.updateTransferFormComplete()
    this.props.updateTransferForm({
      field: 'amount',
      newValue: this.props.formData.amount ? this.props.formData.amount : '0',
    })
    this.props.updateTransferForm({
      field: 'targetPayee',
      newValue: this.props.formData.targetPayee,
    })
  }
  componentWillUnMount() {
    this.props.updateTransferFormComplete()
  }

  get sufficientBalanceClass() {
    const { minimumBalance, remainingBalance } = this.props.formMeta

    return remainingBalance < minimumBalance ? 'has-text-danger' : ''
  }

  render() {
    let isWhiteListed = false
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
      calculatingInProgress,
    } = this.props

    isWhiteListed =
      (this.props.isTestnet &&
        tnetWhiteListedAccount.includes(activeAccount.keypair.publicKey())) ||
      (!this.props.isTestnet && mnetWhiteListedAccount.includes(activeAccount.keypair.publicKey()))

    const transactionFee = isWhiteListed
      ? Number(0).toFixed(7)
      : Math.abs(
          Number(fee) - (currency === 'KEM' ? BASE_NETWORK_FEE / 100 : BASE_NETWORK_FEE),
        ).toFixed(currency === 'KEM' ? 7 : 5)

    return (
      <div className="columns is-mobile is-centered">
        <div className="column is-one-third">
          <section className="section has-text-centered">
            <CurrencyLogo
              currency={currency}
              size={ImageSize.large}
              title={`Send ${this.props.isTestnet ? 'T' + currency : currency}`}
            />
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
                  {renderAmountToDpWithoutRounding(transactionFee, currency === 'KEM' ? 7 : 5)}{' '}
                  {this.props.isTestnet ? 'T' + currency : currency}
                </p>
                <p>
                  {renderAmountToDpWithoutRounding(
                    currency === 'KEM' ? '0.0000001' : '0.00001',
                    currency === 'KEM' ? 7 : 5,
                  )}{' '}
                  {this.props.isTestnet ? 'T' + currency : currency}
                </p>
                <p className={this.sufficientBalanceClass}>
                  {renderAmountToDpWithoutRounding(remainingBalance, currency === 'KEM' ? 7 : 5)}{' '}
                  {this.props.isTestnet ? 'T' + currency : currency}
                </p>
              </div>
            </section>
            <TransferButtons
              cancelText="Cancel"
              nextStepText="Next"
              cancelButtonClick={goBackToDashboard}
              nextStepButtonClick={this.goToConfirmPage}
              isDisabled={calculatingInProgress || this.hasFieldErrors()}
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
