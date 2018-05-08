import * as React from 'react'
import { Connection } from '@types'
import { LabelledField } from '@components'
import { DeleteWallet } from '@containers';

export interface Props {
  publicKey: string
  accountBalance: string
  accountName: string
  isAccountLoading: boolean
  connection: Connection
  loadAccount: (key: string) => any
}

export class WalletInfo extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {
    this.props.loadAccount(this.props.publicKey)
  }

  componentDidUpdate() {
    if (!this.props.isAccountLoading) {
      this.props.loadAccount(this.props.publicKey)
    }
  }

  render() {
    return (
      <div>
        <h1 className='sub-heading primary-font'>Account Information</h1>
        <LabelledField label='Account Name' value={this.props.accountName} />
        <LabelledField label='Public Key' value={this.props.publicKey} />
        <LabelledField label='Kinesis Balance' value={this.props.accountBalance} isLoading={this.props.isAccountLoading} />
        <DeleteWallet />
      </div>
    )
  }
}
