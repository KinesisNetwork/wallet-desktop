import { shallow } from 'enzyme'
import * as React from 'react'

import { SidebarPresentation } from '@containers/Sidebar'
import { SidebarDropdown } from '@containers/Sidebar/SidebarDropdown'
import '../../setupTests'

describe('SidebarPresentation', () => {
  let props

  beforeEach(() => {
     props = {
      activeAccount: {},
      accounts: [],
      addNextAccountFromSeedphrase: () => null,
      setActiveAccount: () => null,
      push: () => null,
    }
  })

  it('should render correctly', () => {
    const wrapper = shallow(<SidebarPresentation {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('SidebarDropdown', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<SidebarDropdown>{() => <span>Test</span>}</SidebarDropdown>)

    expect(wrapper).toMatchSnapshot()
  })
})
