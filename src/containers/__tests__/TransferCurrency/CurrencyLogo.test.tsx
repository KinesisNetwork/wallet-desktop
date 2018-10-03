import { CurrencyLogo } from '@containers/TransferCurrency/CurrencyLogo'
import { ImageSize } from '@types'
import { shallow } from 'enzyme'
import * as React from 'react'
import '../../../setupTests'

describe('CurrencyLogo', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<CurrencyLogo currency="KAU" size={ImageSize.small} />)

    expect(wrapper).toMatchSnapshot()
  })
})
