import { shallow } from 'enzyme';
import * as React from 'react'

import { LabelledField } from '@components/LabelledField';
import { WalletInfo } from '@components/WalletInfo'
import '../../setupTests'

describe('WalletInfo', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<WalletInfo publicKey='' accountBalance='' accountName='' isAccountLoading={true} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should have a primary heading', () => {
    const wrapper = shallow(<WalletInfo publicKey='' accountBalance='' accountName='' isAccountLoading={true} />)

    const heading = wrapper.find('h1')

    expect(heading.text()).toEqual('Account Information')
  })

  it('renders four list items in the tab', () => {
    const wrapper = shallow(<WalletInfo publicKey='' accountBalance='' accountName='' isAccountLoading={true} />)

    const tabs = wrapper.find('li')

    expect(tabs).toHaveLength(4)
    expect(tabs.at(0).text()).toEqual('KAU')
    expect(tabs.at(1).text()).toEqual('KAG')
    expect(tabs.at(2).text()).toEqual('KWG')
    expect(tabs.at(3).text()).toEqual('KWS')
    expect(tabs.at(1).find('a').hasClass('is-disabled')).toBe(true)
    expect(tabs.at(2).find('a').hasClass('is-disabled')).toBe(true)
    expect(tabs.at(3).find('a').hasClass('is-disabled')).toBe(true)
  })

  it('renders three LabelledField components', () => {
    const wrapper = shallow(<WalletInfo publicKey='' accountBalance='' accountName='' isAccountLoading={true} />)

    expect(wrapper.find(LabelledField)).toHaveLength(3)
  })
})
