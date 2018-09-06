import { shallow } from 'enzyme'
import * as React from 'react'

import { Sidebar } from '@components/Sidebar'
import '../../setupTests'

describe('Sidebar', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<Sidebar />)

    expect(wrapper).toMatchSnapshot()
  })
})
