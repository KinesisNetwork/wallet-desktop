import * as React from 'react'

import { AccountDashboard } from '@components/AccountDashboard'
import { AccountPageSelector } from '@containers/AccountPageSelector'
import { Password } from '@containers/Password'
import { Sign } from '@containers/Sign'
import { AccountPage as AccountPageEnum } from '@types'

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
