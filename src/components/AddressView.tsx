import { RootState } from '@store'
import { AddressDisplay } from '@types'
import * as React from 'react'
import { connect } from 'react-redux'
interface OwnProps {
  address: string
  showFull?: boolean
  addressDisplay: AddressDisplay
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  addressInBook:
    ownProps.addressDisplay === AddressDisplay.payee
      ? state.contacts.contactList.find(contact => contact.address === ownProps.address)
      : state.wallet.accounts.find(account => account.keypair.publicKey() === ownProps.address),
})

type Props = OwnProps & ReturnType<typeof mapStateToProps>

const AddressPresentation: React.SFC<Props> = props => {
  const addressDisplay = props.showFull
    ? props.address
    : `${props.address.slice(0, 12)}...${props.address.slice(-4)}`

  return props.addressInBook ? (
    <React.Fragment>{props.addressInBook.name}</React.Fragment>
  ) : (
    <React.Fragment>{addressDisplay}</React.Fragment>
  )
}

const AddressView = connect(mapStateToProps)(AddressPresentation)

export { AddressView }
