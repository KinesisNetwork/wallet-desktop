import { shallow } from 'enzyme';
import * as React from 'react'

import { SidebarPayee } from '@components/SidebarPayee'
import '../../setupTests'

describe('SidebarPayee', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<SidebarPayee changeWalletView={() => null} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders a button', () => {
    const wrapper = shallow(<SidebarPayee changeWalletView={() => null} />)

    const button = wrapper.find('button')

    expect(button).toHaveLength(1)
    expect(button.text()).toEqual('Manage Payees')
  })

  it('calls changeWalletView method if the button is clicked', () => {
    const changeWalletViewMock = jest.fn()
    const wrapper = shallow(<SidebarPayee changeWalletView={changeWalletViewMock} />)

    const button = wrapper.find('button')
    button.simulate('click')

    expect(changeWalletViewMock).toHaveBeenCalled()
  })
})
