import { shallow } from 'enzyme';
import * as React from 'react'

import { WalletList } from '@components/WalletList'
import '../../setupTests'

describe('WalletList', () => {
  let props

  beforeEach(() => {
    props = {
      activeWallet: {},
      addWallet: () => null,
      deleteWallet: () => null,
      selectWallet: () => null,
      wallets: [
        {
          name: 'Fred',
          publicKey: '123'
        },
        {
          name: 'Bob',
          publicKey: '456'
        }
      ]
    }
  })

  it('renders correctly', () => {
    const wrapper = shallow(<WalletList {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders two WalletListItem components and an Add account button', () => {
    const wrapper = shallow(<WalletList {...props} />)

    expect(wrapper.find('.panel-heading').text()).toEqual('Accounts')
    expect(wrapper.find('WalletListItem')).toHaveLength(2)
    expect(wrapper.find('button')).toHaveLength(1)
    expect(wrapper.find('button').text()).toEqual('Add Account')
  })

  it('calls the addWallet on clicking the button', () => {
    const addWalletMock = jest.fn()
    const wrapper = shallow(<WalletList {...props} addWallet={addWalletMock} />)

    const button = wrapper.find('button')
    button.simulate('click')

    expect(addWalletMock).toHaveBeenCalled()
  })
})
