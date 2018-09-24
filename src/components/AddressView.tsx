import { RootState } from '@store'
import { AddressDisplay } from '@types';
import * as React from 'react'
import { connect } from 'react-redux'
interface OwnProps {
  address: string,
  showFull?: boolean
  addressDisplay: AddressDisplay
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  addressInStore: ownProps.addressDisplay === AddressDisplay.payee
    ? state.payees.payeesList.find(payee => payee.publicKey === ownProps.address)
    : state.wallet.accounts.find(account => account.keypair.publicKey() === ownProps.address)
})

type Props = OwnProps & ReturnType<typeof mapStateToProps>

const AddressPresentation: React.SFC<Props> = props => {
  const addressDisplay = props.showFull
    ? props.address
    : `${props.address.slice(0, 12)}...${props.address.slice(-4)}`

  return props.addressInStore
    ? (
      <React.Fragment>{props.addressInStore.name}</React.Fragment>
    ) : (
      <React.Fragment>{addressDisplay}</React.Fragment>
    )
}

const AddressView = connect(mapStateToProps)(AddressPresentation)

export { AddressView }
