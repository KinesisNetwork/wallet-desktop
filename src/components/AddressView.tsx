import { getActiveAccount } from '@selectors'
import { getInactiveAccounts } from '@services/accounts'
import { RootState } from '@store'
import { AddressDisplay } from '@types'
import * as React from 'react'
import { connect } from 'react-redux'
interface OwnProps {
  address: string
  showFull?: boolean
  addressDisplay: AddressDisplay
}

const mapStateToProps = ({ contacts, wallet }: RootState) => ({
  contactList: contacts.contactList,
  accounts: wallet.accounts,
  activeAccount: getActiveAccount(wallet),
})

type Props = OwnProps & ReturnType<typeof mapStateToProps>

const AddressPresentation: React.SFC<Props> = props => {
  const inactiveAccounts = getInactiveAccounts(props.accounts, props.activeAccount)

  const addressInBook =
    props.addressDisplay === AddressDisplay.payee
      ? props.contactList
          .concat(inactiveAccounts)
          .find(contact => contact.address === props.address)
      : props.accounts.find(account => account.keypair.publicKey() === props.address)

  const addressDisplay = props.showFull
    ? props.address
    : `${props.address.slice(0, 12)}...${props.address.slice(-4)}`

  return addressInBook ? (
    <React.Fragment>{addressInBook.name}</React.Fragment>
  ) : (
    <React.Fragment>{addressDisplay}</React.Fragment>
  )
}

const AddressView = connect(mapStateToProps)(AddressPresentation)

export { AddressView }
