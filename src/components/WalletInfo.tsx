import * as React from 'react'

import { LabelledField } from '@components/LabelledField'
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
        <div className="tabs is-small">
          <ul>
            <li className="is-active">
              <a>
                <span className="icon is-small has-text-primary">
                  <i className="fas fa-cubes" />
                </span>
                <span>KAU</span>
              </a>
            </li>
            <li>
              <a className="is-disabled" title="Coming soon!">
                <span className="icon is-small has-text-grey-light">
                  <i className="fas fa-cubes" />
                </span>
                <span>KAG</span>
              </a>
            </li>
            <li>
              <a className="is-disabled" title="Coming soon!">
                KWG
              </a>
            </li>
            <li>
              <a className="is-disabled" title="Coming soon!">
                KWS
              </a>
            </li>
          </ul>
        </div>
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
