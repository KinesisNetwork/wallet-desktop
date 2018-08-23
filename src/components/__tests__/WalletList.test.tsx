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
})
