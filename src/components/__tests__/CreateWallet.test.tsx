import { shallow } from 'enzyme';
import * as React from 'react'

import { CreateWallet, WalletForm } from '@components/CreateWallet'
import '../../setupTests'

describe('CreateWallet', () => {
  it('renders correctly', () => {
    const wrapperWhenFormSelection = shallow(
      <CreateWallet
        accountName=''
        activeView={0}
        addWallet={() => null}
        changeFormView={() => null}
        handleChange={() => null}
        password=''
        passwordVerify=''
        privateKey=''
      />
    )
    const wrapperWhenWalletForm = shallow(
      <CreateWallet
        accountName=''
        activeView={1}
        addWallet={() => null}
        changeFormView={() => null}
        handleChange={() => null}
        password=''
        passwordVerify=''
        privateKey=''
      />
    )

    expect(wrapperWhenFormSelection).toMatchSnapshot()
    expect(wrapperWhenWalletForm).toMatchSnapshot()
  })

  it('should render a primary heading and a FormSelection component if FormView is selected', () => {
    const wrapper = shallow(
      <CreateWallet
        accountName=''
        activeView={0}
        addWallet={() => null}
        changeFormView={() => null}
        handleChange={() => null}
        password=''
        passwordVerify=''
        privateKey=''
      />
    )

    expect(wrapper.find('h1')).toHaveLength(1)
    expect(wrapper.find('h1').text()).toEqual('ADD A NEW ACCOUNT')
    expect(wrapper.find('FormSelection')).toHaveLength(1)
  })

  it('renders a WalletForm if selected as activeView', () => {
    const wrapper = shallow(
      <CreateWallet
        accountName=''
        activeView={1}
        addWallet={() => null}
        changeFormView={() => null}
        handleChange={() => null}
        password=''
        passwordVerify=''
        privateKey=''
      />
    )

    expect(wrapper.find('WalletForm')).toHaveLength(1)
  })
})

describe('WalletForm', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <WalletForm
        accountName=''
        activeView={1}
        addWallet={() => null}
        changeFormView={() => null}
        handleChange={() => null}
        password=''
        passwordVerify=''
        privateKey=''
      />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('renders a primary heading with an icon', () => {
    const wrapper = shallow(
      <WalletForm
        accountName=''
        activeView={1}
        addWallet={() => null}
        changeFormView={() => null}
        handleChange={() => null}
        password=''
        passwordVerify=''
        privateKey=''
      />
    )

    expect(wrapper.find('h1').text()).toEqual('Generate Account')
    expect(wrapper.find('.icon').children().hasClass('fa-user')).toBe(true)
  })

  it('displays a form with three InputForm components and two buttons', () => {
    const wrapper = shallow(
      <WalletForm
        accountName=''
        activeView={1}
        addWallet={() => null}
        changeFormView={() => null}
        handleChange={() => null}
        password=''
        passwordVerify=''
        privateKey=''
      />
    )

    expect(wrapper.find('form')).toHaveLength(1)
    expect(wrapper.find('form').children()).toHaveLength(4)
    expect(wrapper.find('InputField')).toHaveLength(3)
    expect(wrapper.find('button')).toHaveLength(2)
    expect(wrapper.find('button').at(0).text()).toEqual('Generate Account')
    expect(wrapper.find('button').at(1).text()).toEqual('Back')
  })

  it('calls createNewWallet function when submitted', () => {
    const mockCreateNewWallet = jest.fn()
    const wrapper = shallow(
      <WalletForm
        accountName='qwe'
        activeView={1}
        addWallet={mockCreateNewWallet}
        changeFormView={() => null}
        handleChange={() => null}
        password='qwertyuiopas'
        passwordVerify='qwertyuiopas'
        privateKey='zxc'
      />
    )

    const form = wrapper.find('form')
    form.simulate('submit', { preventDefault: () => null })
    expect(mockCreateNewWallet).toHaveBeenCalled()
  })

  it('calls changeFormView function when clicking on the Back button', () => {
    const mockChangeFormView = jest.fn()
    const wrapper = shallow(
      <WalletForm
        accountName='qwe'
        activeView={1}
        addWallet={() => null}
        changeFormView={mockChangeFormView}
        handleChange={() => null}
        password='asd'
        passwordVerify='asd'
        privateKey='zxc'
      />
    )

    const backButton = wrapper.find('.button.is-danger')
    backButton.simulate('click')
    expect(mockChangeFormView).toHaveBeenCalled()
  })
})
