import * as React from 'react'

import {
  AccountPageSelector,
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

export class AccountPage extends React.PureComponent<Props> {
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
        <div style={{display: 'block'}}>
          <div className='level'>
            <div className='level-left'>
              <div className='level-item'>
                <div className='has-text-centered is-constant-height'>
                  <Password />
                </div>
              </div>
            </div>
            <div className='level-right'>
              <div className='level-item'>
                <AccountPageSelector />
              </div>
            </div>
          </div>
        </div>
        {this.accountPageView()}
      </div>
    )
  }
}
