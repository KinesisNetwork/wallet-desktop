import { shallow } from 'enzyme'
import * as React from 'react'

import { Sidebar } from '@containers/Sidebar'
import { SidebarDropdown } from '@containers/Sidebar/SidebarDropdown'
import '../../setupTests'

describe('Sidebar', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<Sidebar />)

    expect(wrapper).toMatchSnapshot()
  })
})

describe('SidebarDropdown', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<SidebarDropdown>{() => <span>Test</span>}</SidebarDropdown>)

    expect(wrapper).toMatchSnapshot()
  })
})
