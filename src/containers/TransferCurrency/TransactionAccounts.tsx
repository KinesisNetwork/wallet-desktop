import { AccountCard } from '@containers/TransferCurrency/AccountCard'
import { getActiveAccount } from '@selectors'
import { RootState } from '@store'
import { AddressDisplay } from '@types'
import * as React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state: RootState) => {
  const { wallet } = state
  return {
    formData: state.transfer.formData,
    walletName: wallet.persisted.walletName,
    contactList: state.contacts.contactList,
    activeAccount: getActiveAccount(wallet),
  }
}

type Props = ReturnType<typeof mapStateToProps>

export const TransactionAccountsPresentation: React.SFC<Props> = props => {
  const getPayeeNameForAvatar = () => {
    const payeeAddress = props.formData.targetPayee
    const payee = props.contactList.find(contact => contact.address === payeeAddress)
    return payee ? payee.name : payeeAddress
  }

  return (
    <React.Fragment>
      <AccountCard
        name={props.walletName}
        addressDisplay={AddressDisplay.account}
        address={props.activeAccount.keypair.publicKey()}
      />
      <div className="column is-narrow">
        <div className="level">
          <div className="level-item">
            <span className="has-text-grey-lighter is-size-2">
              <i className="fal fa-arrow-circle-right" />
            </span>
          </div>
        </div>
      </div>
      <AccountCard
        name={getPayeeNameForAvatar()}
        address={props.formData.targetPayee}
        addressDisplay={AddressDisplay.payee}
      />
    </React.Fragment>
  )
}

const ConnectedTransactionAccounts = connect(mapStateToProps)(TransactionAccountsPresentation)

export { ConnectedTransactionAccounts as TransactionAccounts }
