import { shallow } from 'enzyme'
import * as React from 'react'

import { DeleteWallet } from '@components/DeleteWallet'
import '../../setupTests'

describe('DeleteWallet', () => {
  let props

  beforeEach(() => {
    props = {
      activeWallet: {
        accountName: 'hello',
        encryptedPrivateKey: 'uhgn',
        publicKey: 'qwe',
      },
      deleteWallet: () => null,
    }
  })
  it('should render correctly', () => {
    const wrapper = shallow(<DeleteWallet {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders a button', () => {
    const wrapper = shallow(<DeleteWallet {...props} />)

    expect(wrapper.find('button')).toHaveLength(1)
    expect(wrapper.find('button').text()).toEqual('Delete Account from Wallet')
    expect(
      wrapper
        .find('.icon')
        .children()
        .hasClass('fa-trash-alt'),
    ).toBe(true)
    expect(
      wrapper
        .find('.icon')
        .children()
        .hasClass('fa-lg'),
    ).toBe(true)
  })
})
