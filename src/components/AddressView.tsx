import { RootState } from '@store'
import * as React from 'react'
import { connect } from 'react-redux'

interface OwnProps {
  address: string
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  addressInBook: state.payees.payeesList.find(payee => payee.publicKey === ownProps.address),
})

type Props = OwnProps & ReturnType<typeof mapStateToProps>

const AddressPresentation: React.SFC<Props> = props =>
  props.addressInBook ? (
    <React.Fragment>{props.addressInBook.name}</React.Fragment>
  ) : (
    <React.Fragment>{`${props.address.slice(0, 12)}...${props.address.slice(-4)}`}</React.Fragment>
  )

const AddressView = connect(mapStateToProps)(AddressPresentation)

export { AddressView }
