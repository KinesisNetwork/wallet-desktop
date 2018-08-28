import { shallow } from 'enzyme';
import * as React from 'react'

import { AccountDashboard } from '@components/AccountDashboard'
import '../../setupTests'

describe('AccountDashboard', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<AccountDashboard />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders components in two columns', () => {
    const wrapper = shallow(<AccountDashboard />)

    expect(wrapper.find('.column')).toHaveLength(2)
  })
})
