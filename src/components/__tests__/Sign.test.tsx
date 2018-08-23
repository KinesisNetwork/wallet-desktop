import * as copy from 'copy-to-clipboard'
import { shallow } from 'enzyme';
import { Keypair } from 'js-kinesis-sdk'
import * as React from 'react'
import * as sinon from 'sinon'

import { Sign, SignForm } from '@components/Sign'
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

describe('SignForm', () => {
  let props

  beforeEach(() => {
    props = {
      callFormAlert: () => null,
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

  it('renders correctly', () => {
    const wrapper = shallow(<SignForm {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders a form with an InputField, a Sign button and a Signature field with a Copy button', () => {
    const wrapper = shallow(<SignForm {...props} />)

    const inputField = wrapper.find('InputField')
    const button = wrapper.find('button')

    expect(wrapper.find('form')).toHaveLength(1)
    expect(inputField).toHaveLength(1)
    expect(inputField.prop('label')).toEqual('Message')
    expect(inputField.prop('helpText')).toEqual('Enter the text to sign')
    expect(button).toHaveLength(2)
    expect(button.at(0).text()).toEqual('Sign')
    expect(button.at(1).text()).toEqual('Copy')
  })

  describe('calls callFormAlert', () => {
    it(' if the wallet is locked and the form is submitted', () => {
      const callFormAlertMock = jest.fn()
      const formAlertParam = {
        key: 'wallet-unlock-password',
        message: 'Wallet must be unlocked'
      }
      const wrapper = shallow(<SignForm {...props} callFormAlert={callFormAlertMock} />)

      const form = wrapper.find('form')
      form.simulate('submit', { preventDefault: () => null })

      expect(callFormAlertMock).toHaveBeenCalledWith(formAlertParam)
    })

    it('if the wallet is unlocked but message field is empty', () => {
      const callFormAlertMock = jest.fn()
      const formAlertParam = {
        key: 'signdata-message',
        message: 'Message is required'
      }
      const wrapper = shallow(
        <SignForm
          {...props}
          isWalletUnlocked={true}
          callFormAlert={callFormAlertMock}
        />
      )

      const form = wrapper.find('form')
      form.simulate('submit', { preventDefault: () => null })

      expect(callFormAlertMock).toHaveBeenCalledWith(formAlertParam)
    })
  })

  describe('if wallet is unlocked and a valid message is given', () => {
    it('calls the signMessage method', () => {
      const signMessageMock = jest.fn()
      const modifiedProps = {
        decryptedPrivateKey: '123',
        isWalletUnlocked: true,
        signData: {
          message: 'My Message'
        }
      }
      const wrapper = shallow(
        <SignForm
          {...props}
          {...modifiedProps}
          signMessage={signMessageMock}
        />
      )
      const keypairSpy = jest
        .spyOn(Keypair, 'fromSecret')
        .mockImplementation(() => ({ sign: () => 'qwe' }))

      const form = wrapper.find('form')
      form.simulate('submit', { preventDefault: () => null })

      expect(signMessageMock).toHaveBeenCalled()

      keypairSpy.mockReset()
    })

    it('displays the signature in the signature input field and enables the copy button', () => {
      const wrapper = shallow(
        <SignForm
          {...props}
          signature='asdf'
        />
      )

      const signatureLabel = wrapper.find('.label.is-small')
      const signatureInput = wrapper.find('input')
      const copyButton = wrapper.find('button').at(1)

      expect(signatureLabel).toHaveLength(1)
      expect(signatureLabel.text()).toEqual('Signature')
      expect(signatureInput).toHaveLength(1)
      expect(signatureInput.prop('value')).toEqual('asdf')
      expect(signatureInput.prop('readOnly')).toEqual(true)
      expect(signatureInput.prop('disabled')).toEqual(true)
      expect(copyButton.prop('disabled')).toEqual(false)
    })
  })
})
