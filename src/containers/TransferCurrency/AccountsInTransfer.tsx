import { AccountCard } from '@containers/TransferCurrency/AccountCard'
import { getActiveAccount } from '@selectors'
import { getInactiveAccounts } from '@services/accounts'
import { RootState } from '@store'
import { AddressDisplay } from '@types'
import * as React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ wallet, transfer, contacts }: RootState) => ({
  formData: transfer.formData,
  walletName: wallet.persisted.walletName,
  contactList: contacts.contactList,
  activeAccount: getActiveAccount(wallet),
  accounts: wallet.accounts,
})

type Props = ReturnType<typeof mapStateToProps>

export const AccountsInTransferPresentation: React.SFC<Props> = props => {
  const inactiveAccounts = getInactiveAccounts(props.accounts, props.activeAccount)

  const getPayeeNameForAvatar = () => {
    const payeeAddress = props.formData.targetPayee
    const payee = props.contactList
      .concat(inactiveAccounts)
      .find(contact => contact.address === payeeAddress)
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

const AccountsInTransfer = connect(mapStateToProps)(AccountsInTransferPresentation)

export { AccountsInTransfer }
