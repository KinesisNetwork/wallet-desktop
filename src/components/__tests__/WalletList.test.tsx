import { shallow } from 'enzyme'
import * as React from 'react'

import { WalletList, WalletListItem } from '@components/WalletList'
import '../../setupTests'

describe('WalletList', () => {
  const props = {
    activeWallet: {
      accountName: 'Fred',
      publicKey: '123',
      encryptedPrivateKey: '',
    },
    addWallet: () => null,
    deleteWallet: () => null,
    selectWallet: () => null,
    wallets: [
      {
        accountName: 'Fred',
        publicKey: '123',
        encryptedPrivateKey: '',
      },
      {
        accountName: 'Bob',
        publicKey: '456',
        encryptedPrivateKey: '',
      },
    ],
  }

  it('renders correctly', () => {
    const wrapper = shallow(<WalletList {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders two WalletListItem components and an Add account button', () => {
    const wrapper = shallow(<WalletList {...props} />)

    expect(wrapper.find('.panel-heading').text()).toEqual('Accounts')
    expect(wrapper.find('WalletListItem')).toHaveLength(2)
    expect(wrapper.find('NavLink')).toHaveLength(1)
  })
})

describe('WalletListItem', () => {
  let props

  beforeEach(() => {
    props = {
      deleteWallet: () => null,
      isActive: true,
      selectWallet: () => null,
      wallet: {
        accountName: 'Fred',
        encryptedPrivateKey: 'qwer',
        publicKey: '123',
      },
    }
  })

  it('renders correctly', () => {
    const wrapper = shallow(<WalletListItem {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('displays the element as an anchor tag and calls selectWallet on click', () => {
    const selectWalletMock = jest.fn()
    const selectWalletMockParam = {
      accountName: 'Fred',
      encryptedPrivateKey: 'qwer',
      publicKey: '123',
    }
    const wrapper = shallow(<WalletListItem {...props} selectWallet={selectWalletMock} />)

    const element = wrapper.find('NavLink')
    expect(element).toHaveLength(1)

    element.simulate('click')

    expect(selectWalletMock).toHaveBeenCalledWith(selectWalletMockParam)
  })

  it('renders the account name and a delete button', () => {
    const wrapper = shallow(<WalletListItem {...props} />)

    expect(wrapper.find('.info').text()).toEqual('Fred')
    expect(wrapper.find('NavLink')).toHaveLength(1)
  })

  it('calls the deleteWallet method on clicking the button', () => {
    const deleteWalletMock = jest.fn()
    const deleteWalletMockParam = {
      accountName: 'Fred',
      encryptedPrivateKey: 'qwer',
      publicKey: '123',
    }
    const wrapper = shallow(<WalletListItem {...props} deleteWallet={deleteWalletMock} />)

    const deleteButton = wrapper.find('button')
    expect(deleteButton.find('i').hasClass('fa-trash-alt')).toBe(true)

    deleteButton.simulate('click')

    expect(deleteWalletMock).toHaveBeenCalledWith(deleteWalletMockParam)
  })
})
