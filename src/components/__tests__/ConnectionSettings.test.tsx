import { shallow } from 'enzyme'
import * as React from 'react'

import { ConnectionSettings } from '@components/ConnectionSettings'
import '../../setupTests'

describe('ConnectionSettings', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<ConnectionSettings />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render a primary heading, a ConnectionSelector and a ConnectionForm', () => {
    const wrapper = shallow(<ConnectionSettings />)

    expect(wrapper.find('h1')).toHaveLength(1)
    expect(wrapper.find('h1').text()).toEqual('Manage Connections')
    expect(wrapper.find('Connect(ConnectionSelectorComponent)')).toHaveLength(1)
  })
})
