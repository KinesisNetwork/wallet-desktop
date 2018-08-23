import { shallow } from 'enzyme';
import * as React from 'react'

import { Sign } from '@components/Sign'
import '../../setupTests'

describe('Sign', () => {
  let props

  beforeEach(() => {
    props = {
      changeSignFocus: () => null,
      decryptedPrivateKey: '',
      focus: 'Sign',
      handleSignFormChange: () => null,
      handleSignVerifyFormChange: () => null,
      isValidSignature: false,
      isWalletUnlocked: false,
      messageVerificationResult: () => null,
      signData: {
        message: ''
      },
      signMessage: () => null,
      signature: '',
      verifyData: {
        message: '',
        publicKey: '',
        signature: ''
      }
    }
  })

  it('should render correctly', () => {
    const wrapper = shallow(<Sign {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders three tabs', () => {
    const wrapper = shallow(<Sign {...props} />)

    const tabs = wrapper.find('.tabs')
    const tab = tabs.find('li')

    expect(tab).toHaveLength(3)
    expect(tab.at(0).hasClass('is-active')).toBe(true)
    expect(tab.at(0).text()).toEqual('Sign')
    expect(tab.at(1).text()).toEqual('Verify')
    expect(tab.at(2).text()).toEqual('Sign Transaction')
  })

  describe('depending on the focus prop', () => {
    it('renders SignForm component', () => {
      const wrapper = shallow(<Sign {...props} />)

      expect(wrapper.find('SignForm')).toHaveLength(1)
    })

    it('renders VerifyForm', () => {
      const wrapper = shallow(<Sign {...props} focus='Verify' />)

      expect(wrapper.find('VerifyForm')).toHaveLength(1)
    })

    it('renders SignTransactionForm', () => {
      const wrapper = shallow(<Sign {...props} focus='Sign Transaction' />)

      expect(wrapper.find('Connect(SignTransactionForm)')).toHaveLength(1)
    })
  })
})
