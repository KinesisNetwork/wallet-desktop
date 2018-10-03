import { AmountPresentation } from '@containers/TransferCurrency/AmountPresentation'
import { shallow } from 'enzyme'
import * as React from 'react'
import '../../../setupTests'

describe('AmountPresentation', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<AmountPresentation amount="1" text="KAU" currency="KAU" />)
    expect(wrapper).toMatchSnapshot()
  })
})
