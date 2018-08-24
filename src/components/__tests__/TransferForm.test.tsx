import { shallow } from 'enzyme';
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
          publicKey: '123'
        }
      ],
      targetPayee: 'asdf',
      transferRequest: () => null,
      updateTransferForm: () => null
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

  it('renders a PayeeSelector, three InputField components and two buttons', () => {
    const wrapper = shallow(<TransferForm {...props} />)

    const button = wrapper.find('button')

    expect(wrapper.find('PayeeSelector')).toHaveLength(1)
    expect(wrapper.find('InputField')).toHaveLength(3)
    expect(button).toHaveLength(2)
    expect(button.at(0).text()).toBe('Transfer')
    expect(button.at(1).find('i').hasClass('fa-copy')).toBe(true)
    expect(button.at(1).prop('title')).toEqual('Copy Transaction')
  })
})
