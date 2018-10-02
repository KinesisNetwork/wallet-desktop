import { AccountsInTransferPresentation } from '@containers/TransferCurrency/AccountsInTransfer'
import { shallow } from 'enzyme'
import * as React from 'react'
import '../../../setupTests'

describe('AccountsInTransfer', () => {
  let props

  beforeEach(() => {
    props = {
      formData: {
        targetPayee: '123qwe',
        amount: '0.5',
        memo: 'transfer',
        fee: '0.0002',
      },
      wallerName: 'my wallet',
      contactList: [
        {
          name: 'John',
          address: '123qwe',
        },
      ],
      activeAccount: {
        name: 'Account 1',
        keypair: {
          publicKey: () => null,
        },
      },
    }
  })

  it('should render correctly', () => {
    const wrapper = shallow(<AccountsInTransferPresentation {...props} />)

    expect(wrapper).toMatchSnapshot()
  })
})
