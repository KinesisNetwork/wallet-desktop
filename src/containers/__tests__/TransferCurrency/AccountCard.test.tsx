import { AccountCard } from '@containers/TransferCurrency/AccountCard'
import { AddressDisplay } from '@types'
import { shallow } from 'enzyme'
import * as React from 'react'
import '../../../setupTests'

describe('AccountCard', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <AccountCard name="hi" address="123qwe" addressDisplay={AddressDisplay.account} />,
    )

    expect(wrapper).toMatchSnapshot()
  })
})
