import { shallow } from 'enzyme'
import * as React from 'react'

import { SidebarPayee } from '@components/SidebarPayee'
import '../../setupTests'

describe('SidebarPayee', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<SidebarPayee />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders a button', () => {
    const wrapper = shallow(<SidebarPayee />)

    const button = wrapper.find('button')

    expect(button).toHaveLength(1)
    expect(button.text()).toEqual('Manage Payees')
  })
})
