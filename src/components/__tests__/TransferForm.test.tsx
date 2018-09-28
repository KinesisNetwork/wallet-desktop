import { shallow } from 'enzyme'
import * as React from 'react'

import { TransferForm } from '@components/TransferForm'
import '../../setupTests'

describe('TransferForm', () => {
  let props

  beforeEach(() => {
    props = {
      accountBalance: '2',
      activeWallet: {},
      amount: '0.1',
      changeTransferView: () => null,
      changeWalletView: () => null,
      connection: {},
      getFee: () => null,
      invalidForm: () => null,
      isTransferring: false,
      isWalletUnlocked: true,
      memo: '',
      payees: [
        {
          name: 'Fred',
          publicKey: '123',
        },
      ],
      payeePublicKey: 'asdf',
      transferRequest: () => null,
      updateTransferForm: () => null,
    }
  })

  it('renders correctly', () => {
    const wrapper = shallow(<TransferForm {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('displays Loader component if isTransferring is true', () => {
    const wrapper = shallow(<TransferForm {...props} isTransferring={true} />)

    expect(wrapper.find('Loader')).toHaveLength(1)
  })
})
