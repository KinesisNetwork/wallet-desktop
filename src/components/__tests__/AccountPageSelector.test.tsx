import { shallow } from 'enzyme';
import * as React from 'react'

import { AccountPageSelector } from '@components/AccountPageSelector'
import { AccountPage as AccountPageEnum } from '@types'
import '../../setupTests'

describe('AccountPageSelector', () => {
  it('renders correctly', () => {
    const wrapperWhenDashboard = shallow(<AccountPageSelector accountPage={AccountPageEnum.dashboard} setAccountPage={() => null} />)
    const wrapperWhenSign = shallow(<AccountPageSelector accountPage={AccountPageEnum.sign} setAccountPage={() => null} />)

    expect(wrapperWhenDashboard).toMatchSnapshot()
    expect(wrapperWhenSign).toMatchSnapshot()
  })

  it('should render both transfer and sign buttons', () => {
    const wrapper = shallow(<AccountPageSelector accountPage={AccountPageEnum.dashboard} setAccountPage={() => null} />)

    const buttons = wrapper.find('button')

    expect(buttons).toHaveLength(2)
    expect(buttons.at(0).find('i').hasClass('fa-home')).toBe(true)
    expect(buttons.at(1).find('i').hasClass('fa-pencil-alt')).toBe(true)
  })

  it('makes dashboard button active', () => {
    const setAccountPageStub = jest.fn()
    const wrapper = shallow(<AccountPageSelector accountPage={AccountPageEnum.dashboard} setAccountPage={setAccountPageStub} />)

    const buttons = wrapper.find('button')
    const dashboardButton = buttons.at(0)
    const signButton = buttons.at(1)

    expect(dashboardButton.hasClass('is-active')).toBe(true)
    expect(signButton.hasClass('is-active')).toBe(false)

    dashboardButton.simulate('click')
    expect(setAccountPageStub).toHaveBeenCalledTimes(1)
    expect(setAccountPageStub).toHaveBeenCalledWith(AccountPageEnum.dashboard)
  })

  it('makes sign button active', () => {
    const setAccountPageStub = jest.fn()
    const wrapper = shallow(<AccountPageSelector accountPage={AccountPageEnum.sign} setAccountPage={setAccountPageStub} />)

    const buttons = wrapper.find('button')
    const dashboardButton = buttons.at(0)
    const signButton = buttons.at(1)

    expect(buttons).toHaveLength(2)
    expect(dashboardButton.hasClass('is-active')).toBe(false)
    expect(signButton.hasClass('is-active')).toBe(true)

    signButton.simulate('click')
    expect(setAccountPageStub).toHaveBeenCalledTimes(1)
    expect(setAccountPageStub).toHaveBeenCalledWith(AccountPageEnum.sign)
  })
})
