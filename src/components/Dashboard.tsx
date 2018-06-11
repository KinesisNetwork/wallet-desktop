import * as React from 'react'

import {
  AccountPage,
  Password,
  Sign,
  Transactions,
  Transfer,
  WalletInfo,
} from '@containers'
import { AccountPage as AccountPageEnum } from '@types'

export interface Props {
  accountPage: AccountPageEnum
}

export const TransferPage: React.SFC = () => (
  <React.Fragment>
    <div className='columns is-constant-height'>
      <div className='column'>
        <WalletInfo />
      </div>
      <div className='column'>
        <Transfer />
      </div>
    </div>
    <Transactions />
  </React.Fragment>
)

export class Dashboard extends React.PureComponent<Props> {
  constructor(props) {
    super(props)
  }

  accountPageView = () => {
    switch (this.props.accountPage) {
      case AccountPageEnum.transfer: return <TransferPage />
      case AccountPageEnum.sign: return <Sign />
      default: return <div />
    }
  }

  render() {
    return (
      <div className='vertical-spaced'>
        <div className='columns'>
          <div className='has-text-centered is-constant-height column is-four-fifths'>
            <Password />
          </div>
          <div className='column'>
            <AccountPage />
          </div>
        </div>
        {this.accountPageView()}
      </div>
    )
  }
}
