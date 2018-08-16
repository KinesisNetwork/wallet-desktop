import { shallow } from 'enzyme';
import * as React from 'react'

import { AccountPageSelector } from '@components/AccountPageSelector'
import { AccountPage as AccountPageEnum } from '@types'
import '../../setupTests'

describe('AccountPageSelector', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<AccountPageSelector />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render both transfer and sign buttons', () => {
    const wrapper = shallow(<AccountPageSelector />)

    const buttons = wrapper.find('button')

    expect(buttons).toHaveLength(2)
    expect(buttons.at(0).find('i').hasClass('fa-home')).toBe(true)
    expect(buttons.at(1).find('i').hasClass('fa-pencil-alt')).toBe(true)
  })

  it('makes dashboard button active', () => {
    const setAccountPageStub = jest.fn()
    const wrapper = shallow(<AccountPageSelector accountPage={AccountPageEnum.dashboard} setAccountPage={setAccountPageStub} />)

    const buttons = wrapper.find('button')

    expect(buttons.at(0).hasClass('is-active')).toBe(true)
    expect(buttons.at(1).hasClass('is-active')).toBe(false)
  })

  it('makes sign button active', () => {
    const setAccountPageStub = jest.fn()
    const wrapper = shallow(<AccountPageSelector accountPage={AccountPageEnum.sign} setAccountPage={setAccountPageStub} />)

    const buttons = wrapper.find('button')

    expect(buttons).toHaveLength(2)
    expect(buttons.at(0).hasClass('is-active')).toBe(false)
    expect(buttons.at(1).hasClass('is-active')).toBe(true)
  })
})
