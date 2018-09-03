import * as React from 'react'

import { LabelledField } from '@components/LabelledField'
import { CurrencySelector } from '@containers/CurrencySelector'
import { renderAmount } from '@services/util'

export interface Props {
  publicKey: string
  accountBalance: number
  accountName: string
  isAccountLoading: boolean
}

export class WalletInfo extends React.Component<Props> {
  displayName = 'WalletInfo'

  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <h1 className="sub-heading primary-font">Account Information</h1>
        <CurrencySelector />
        <LabelledField label="Account Name" value={this.props.accountName} />
        <LabelledField
          label="Kinesis Balance"
          value={renderAmount(this.props.accountBalance)}
          isLoading={this.props.isAccountLoading}
        />
        <LabelledField label="Public Key" value={this.props.publicKey} isCopyable={true} />
        <div
          className="is-divider is-hidden-tablet"
          style={{ margin: 0, borderTopWidth: '0.01rem' }}
        />
      </React.Fragment>
    )
  }
}
