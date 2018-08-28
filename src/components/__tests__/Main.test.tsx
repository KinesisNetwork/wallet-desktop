import { shallow } from 'enzyme';
import * as React from 'react'

import { Main } from '@components/Main'
import '../../setupTests'

describe('Main', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Main activeView={0} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('always renders Sidebar plus the relevant component', () => {
    const createWalletWrapper = shallow(<Main activeView={0} />)
    const connectionSettingsWrapper = shallow(<Main activeView={1} />)
    const accountPageWrapper = shallow(<Main activeView={2} />)
    const payeeWrapper = shallow(<Main activeView={3} />)

    expect(createWalletWrapper.find('Sidebar')).toHaveLength(1)
    expect(createWalletWrapper.find('Connect(CreateWallet)')).toHaveLength(1)
    expect(connectionSettingsWrapper.find('Sidebar')).toHaveLength(1)
    expect(connectionSettingsWrapper.find('ConnectionSettings')).toHaveLength(1)
    expect(accountPageWrapper.find('Sidebar')).toHaveLength(1)
    expect(accountPageWrapper.find('Connect(AccountPage)')).toHaveLength(1)
    expect(payeeWrapper.find('Sidebar')).toHaveLength(1)
    expect(payeeWrapper.find('Payee')).toHaveLength(1)
  })
})
