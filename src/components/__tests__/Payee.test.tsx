import { shallow } from 'enzyme'
import * as React from 'react'

import { Payee } from '@components/Payee'
import '../../setupTests'

describe('Payee', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Payee />)

    expect(wrapper).toMatchSnapshot()
  })

  it('returns PayeeList and PayeeForm components', () => {
    const wrapper = shallow(<Payee />)

    expect(wrapper.children()).toHaveLength(2)
    expect(wrapper.find('Connect(PayeeList)')).toHaveLength(1)
    expect(wrapper.find('Connect(PayeeForm)')).toHaveLength(1)
    expect(wrapper.find('h1').text()).toEqual('ADD A NEW PAYEE')
  })
})
