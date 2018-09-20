import { shallow } from 'enzyme'
import * as React from 'react'

import { SidebarPresentation } from '@containers/Sidebar'
import { SidebarDropdown } from '@containers/Sidebar/SidebarDropdown'
import '../../setupTests'

describe('SidebarPresentation', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<SidebarPresentation />)

    expect(wrapper).toMatchSnapshot()
  })
})

describe('SidebarDropdown', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<SidebarDropdown>{() => <span>Test</span>}</SidebarDropdown>)

    expect(wrapper).toMatchSnapshot()
  })
})
