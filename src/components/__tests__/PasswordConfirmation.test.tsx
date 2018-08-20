import { shallow } from 'enzyme';
import * as React from 'react'

import { PasswordInput } from '@components/PasswordConfirmation'
import '../../setupTests'

describe('PasswordInput', () => {
  let props

  beforeEach(() => {
    props = {
      activeWallet: {
        accountName: 'myAccount',
        encryptedPrivateKey: '123',
        publicKey: 'qwe'
      }
    }
  })

  it('should render correctly', () => {
    const wrapper = shallow(<PasswordInput {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('returns an input field with the entereed password', () => {
    const wrapper = shallow(<PasswordInput {...props} />)

    expect(wrapper.find('input')).toHaveLength(1)

    wrapper.setState({ password: 'asd' })

    expect(wrapper.find('input').prop('value')).toEqual('asd')
  })

  it('triggers the changeText method on entering values in the input field', () => {
    const wrapper = shallow(<PasswordInput {...props} />)
    const changeTextSpy = jest
      .spyOn(wrapper.instance() as PasswordInput, 'changeText')
      .mockImplementation(() => null)
    const eventObj = { target: { value: 'a' } }

    wrapper.find('input').simulate('change', eventObj)

    expect(changeTextSpy).toHaveBeenCalledWith(eventObj)

    changeTextSpy.mockReset()
  })
})
