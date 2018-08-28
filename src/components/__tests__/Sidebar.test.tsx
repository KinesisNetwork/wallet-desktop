import { shallow } from 'enzyme';
import * as React from 'react'

import { Sidebar } from '@components/Sidebar'
import '../../setupTests'

describe('Sidebar', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<Sidebar />)

    expect(wrapper).toMatchSnapshot()
  })

  it('displays the logo and three components', () => {
    const wrapper = shallow(<Sidebar />)

    expect(wrapper.find('img')).toHaveLength(1)
    expect(wrapper.find('Connect(WalletList)')).toHaveLength(1)
    expect(wrapper.find('Connect(SidebarPayee)')).toHaveLength(1)
    expect(wrapper.find('Connect(SidebarSettings)')).toHaveLength(1)
  })
})
