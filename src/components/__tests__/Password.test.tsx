import { shallow } from 'enzyme'
import * as React from 'react'

import { LockedWallet, Password, UnlockedWallet } from '@components/Password'
import '../../setupTests'

describe('Password', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <Password
        activePublicKey=""
        decryptedPrivateKey=""
        isAccountUnlocked={false}
        password=""
        unlockWallet={() => null}
        setPasswordInput={() => null}
        lockWallet={() => null}
      />,
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should render LockedWallet if isAccountUnlocked is false', () => {
    const wrapper = shallow(
      <Password
        activePublicKey=""
        decryptedPrivateKey=""
        isAccountUnlocked={false}
        password=""
        unlockWallet={() => null}
        setPasswordInput={() => null}
        lockWallet={() => null}
      />,
    )

    expect(wrapper.find('LockedWallet')).toHaveLength(1)
  })

  it('renders UnlockedWallet component if isAccountUnlocked is true', () => {
    const wrapper = shallow(
      <Password
        activePublicKey=""
        decryptedPrivateKey=""
        isAccountUnlocked={true}
        password=""
        unlockWallet={() => null}
        setPasswordInput={() => null}
        lockWallet={() => null}
      />,
    )

    expect(wrapper.find('UnlockedWallet')).toHaveLength(1)
  })
})

describe('UnlockWallet', () => {
  const props = {
    activePublicKey: '',
    decryptedPrivateKey: 'decrypted',
    isAccountUnlocked: true,
    password: '',
    unlockWallet: () => null,
    setPasswordInput: () => null,
    lockWallet: () => null,
  }

  it('renders correctly', () => {
    const wrapper = shallow(<UnlockedWallet {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders two buttons', () => {
    const wrapper = shallow(<UnlockedWallet {...props} />)

    const buttons = wrapper.find('button')

    expect(buttons).toHaveLength(2)
    expect(buttons.at(0).text()).toEqual('Private Key')
    expect(
      buttons
        .at(1)
        .find('i')
        .hasClass('fa-lock'),
    ).toBe(true)
  })

  it('calls the lockWallet method on clicking the second button', () => {
    const lockWalletMock = jest.fn()
    const wrapper = shallow(<UnlockedWallet {...props} lockWallet={lockWalletMock} />)

    const button = wrapper.find('button').at(1)
    button.simulate('click')

    expect(lockWalletMock).toHaveBeenCalled()
  })
})

describe('LockedWallet', () => {
  const props = {
    activePublicKey: '',
    decryptedPrivateKey: '',
    isAccountUnlocked: false,
    password: '123',
    unlockWallet: () => null,
    setPasswordInput: () => null,
    lockWallet: () => null,
  }

  it('renders correctly', () => {
    const wrapper = shallow(<LockedWallet {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render an input field and an unlock button', () => {
    const wrapper = shallow(<LockedWallet {...props} />)

    const input = wrapper.find('input')
    const button = wrapper.find('button')

    expect(input).toHaveLength(1)
    expect(input.prop('value')).toEqual('123')
    expect(button).toHaveLength(1)
    expect(button.find('i')).toHaveLength(1)
    expect(button.find('i').hasClass('fa-lock-open')).toBe(true)
  })

  it('triggers setPasswordInput method on change event', () => {
    const setPasswordInputMock = jest.fn()
    const wrapper = shallow(<LockedWallet {...props} setPasswordInput={setPasswordInputMock} />)

    const input = wrapper.find('input')
    input.simulate('change', { currentTarget: { value: '123' } })

    expect(setPasswordInputMock).toHaveBeenCalledWith('123')
  })

  it('triggers unLockWallet method on clicking the button', () => {
    const unLockWalletMock = jest.fn()
    const wrapper = shallow(<LockedWallet {...props} unlockWallet={unLockWalletMock} />)

    wrapper.find('button').simulate('click')
    expect(unLockWalletMock).toHaveBeenCalled()
  })
})
