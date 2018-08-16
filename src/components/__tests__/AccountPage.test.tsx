import { shallow } from 'enzyme';
import * as React from 'react'

import { AccountPage } from '@components/AccountPage'
import { AccountPage as AccountPageEnum } from '@types'

import { AccountDashboard } from '@components/AccountDashboard';
import '../../setupTests'

describe('AccountPage', () => {
  it('should render properly', () => {
    const wrapperWhenAccountDashboard = shallow(<AccountPage accountPage={AccountPageEnum.dashboard} />)
    const wrapperWhenSign = shallow(<AccountPage accountPage={AccountPageEnum.sign} />)

    expect(wrapperWhenAccountDashboard).toMatchSnapshot()
    expect(wrapperWhenSign).toMatchSnapshot()
  })

  it('renders components if accountPage property is given', () => {
    const wrapperWhenAccountDashboard = shallow(<AccountPage accountPage={AccountPageEnum.dashboard} />)
    const wrapperWhenSign = shallow(<AccountPage accountPage={AccountPageEnum.sign} />)

    expect(wrapperWhenAccountDashboard.children()).toHaveLength(2)
    expect(wrapperWhenAccountDashboard.find(AccountDashboard)).toHaveLength(1)
    expect(wrapperWhenSign.find('Connect(Sign)')).toHaveLength(1)
  })
})
