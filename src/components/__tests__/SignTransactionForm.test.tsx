import { shallow } from 'enzyme'
import * as React from 'react'

import { SignTransactionForm } from '@components/SignTransactionForm'

describe('SignedTransactionForm', () => {
  let props

  beforeEach(() => {
    props = {
      connection: {
        horizonURL: 'https://kau-testnet.kinesisgroup.io',
        name: 'Kinesis KAU Testnet',
        networkPassphrase: 'Kinesis UAT',
      },
      decryptedPrivateKey: () => null,
      message: '',
      submissionPending: false,
      transactionRequest: () => null,
      updateSignTransactionForm: () => null,
    }
  })

  it('renders correctly', () => {
    const wrapper = shallow(<SignTransactionForm {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders an InputField and four buttons', () => {
    const wrapper = shallow(<SignTransactionForm {...props} />)

    const inputField = wrapper.find('InputField')
    const button = wrapper.find('button')

    expect(inputField).toHaveLength(1)
    expect(inputField.prop('label')).toEqual('Transaction')
    expect(inputField.prop('helpText')).toEqual('Paste the serialized transaction here')
    expect(button).toHaveLength(4)
    expect(button.at(0).text()).toEqual('Load')
    expect(button.at(1).text()).toEqual('Sign')
    expect(button.at(2).text()).toEqual('Copy')
    expect(button.at(3).text()).toEqual('Submit')
  })
})
