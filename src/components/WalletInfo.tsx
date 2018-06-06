import { LabelledField } from '@components'
import * as React from 'react'

export interface Props {
  publicKey: string
  accountBalance: string
  accountName: string
  isAccountLoading: boolean
}

export class WalletInfo extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h1 className='sub-heading primary-font'>Account Information</h1>
        <div className='tabs is-small'>
          <ul>
            <li className='is-active'>
              <a>
                <span className='icon is-small has-text-primary'><i className='fas fa-cubes' /></span>
                <span>KAU</span>
              </a>
            </li>
            <li>
              <a>
                <span className='icon is-small has-text-grey-light'><i className='fas fa-cubes' /></span>
                <span>KAG</span>
              </a>
            </li>
            <li><a>KWG</a></li>
            <li><a>KWS</a></li>
          </ul>
        </div>
        <LabelledField label='Account Name' value={this.props.accountName} />
        <LabelledField label='Public Key' value={this.props.publicKey} />
        <LabelledField
          label='Kinesis Balance'
          value={this.props.accountBalance}
          isLoading={this.props.isAccountLoading}
        />
        <div className='is-divider is-hidden-tablet' style={{ margin: 0, borderTopWidth: '0.01rem' }} />
      </div>
    )
  }
}
