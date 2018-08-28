import { shallow } from 'enzyme';
import * as React from 'react'

import { SidebarSettings } from '@components/SidebarSettings'
import '../../setupTests'

describe('SidebarSettings', () => {
  let props

  beforeEach(() => {
    props = {
      changeWalletView: () => null,
      connectionName: 'Kinesis KAU Testnet'
    }
  })

  it('renders correctly', () => {
    const wrapper = shallow(<SidebarSettings {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders the connection name and a settings button', () => {
    const wrapper = shallow(<SidebarSettings {...props} />)

    const label = wrapper.find('label')
    const button = wrapper.find('button')

    expect(label).toHaveLength(1)
    expect(label.text()).toEqual('Connection: Kinesis KAU Testnet')
    expect(button).toHaveLength(1)
    expect(button.text()).toEqual('Settings')
  })

  it('calls the changeWalletView method when the button is clicked', () => {
    const changeWalletViewMock = jest.fn()
    const wrapper = shallow(<SidebarSettings {...props} changeWalletView={changeWalletViewMock} />)

    const button = wrapper.find('button')
    button.simulate('click')

    expect(changeWalletViewMock).toHaveBeenCalled()
  })
})
