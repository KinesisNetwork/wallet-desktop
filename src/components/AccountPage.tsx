import { AccountDashboard } from '@components'
import {
  AccountPageSelector,
  Password,
  Sign,
} from '@containers'
import { AccountPage as AccountPageEnum } from '@types'
import * as React from 'react'

export interface Props {
  accountPage: AccountPageEnum
}

export class AccountPage extends React.PureComponent<Props> {
  constructor(props) {
    super(props)
  }

  accountPageView = () => {
    switch (this.props.accountPage) {
      case AccountPageEnum.dashboard: return <AccountDashboard />
      case AccountPageEnum.sign: return <Sign />
      default: return <div />
    }
  }

  render() {
    return (
      <div className='vertical-spaced'>
        <div>
          <div className='level'>
            <div className='level-left'>
              <div className='level-item'>
                <AccountPageSelector />
              </div>
            </div>
            <div className='level-right'>
              <div className='level-item'>
                <Password />
              </div>
            </div>
          </div>
        </div>
        {this.accountPageView()}
      </div>
    )
  }
}
