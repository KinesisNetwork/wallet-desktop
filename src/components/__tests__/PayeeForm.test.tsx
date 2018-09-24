import { shallow } from 'enzyme'
import * as React from 'react'

import { PayeeForm } from '@components/PayeeForm'
import '../../setupTests'

describe('PayeeForm', () => {
  let props

  beforeEach(() => {
    props = {
      activeWalletView: 3,
      payee: {
        name: '',
        publicKey: '',
      },
      addPayee: () => null,
      cancelForm: () => null,
      handleChange: () => null,
      callFormAlert: () => null,
    }
  })

  it('renders correctly', () => {
    const wrapper = shallow(<PayeeForm {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('returns a form with two InputField components and a button', () => {
    const wrapper = shallow(<PayeeForm {...props} />)

    const form = wrapper.find('form')

    expect(form.children()).toHaveLength(3)
    expect(form.find('InputField')).toHaveLength(2)
    expect(form.find('button')).toHaveLength(1)
    expect(form.find('button').text()).toEqual('Set Payee')
  })

  it("assigns the values of payee to InputField component's value", () => {
    const wrapper = shallow(
      <PayeeForm
        {...props}
        payee={{
          name: 'Fred',
          publicKey: '123',
        }}
      />,
    )

    const inputFields = wrapper.find('InputField')

    expect(inputFields.at(0).prop('value')).toEqual('Fred')
    expect(inputFields.at(1).prop('value')).toEqual('123')
  })

  it('calls the createNewPayee method on submitting the form', () => {
    const newPayee = {
      name: 'Fred',
      publicKey: '123',
    }
    const createNewPayeeMock = jest.fn()
    const wrapper = shallow(<PayeeForm {...props} payee={newPayee} addPayee={createNewPayeeMock} />)

    const form = wrapper.find('form')

    form.simulate('submit', { preventDefault: () => null })
    expect(createNewPayeeMock).toHaveBeenCalledWith(newPayee)
  })

  it('calls formAlert if validation is unsuccessful', () => {
    const messageAndKey = {
      message: 'Name is required',
      key: 'input-payee-name',
    }
    const formAlertMock = jest.fn()
    const wrapper = shallow(<PayeeForm {...props} formIsInvalid={formAlertMock} />)

    const form = wrapper.find('form')

    form.simulate('submit', { preventDefault: () => null })
    expect(formAlertMock).toHaveBeenCalledWith(messageAndKey)
  })

  describe('renders a cancel button', () => {
    it('if active wallet view is not set to payees', () => {
      const wrapper = shallow(<PayeeForm {...props} activeWalletView={2} />)

      const buttons = wrapper.find('button')

      expect(buttons).toHaveLength(2)

      const cancelButton = buttons.at(1)

      expect(cancelButton.hasClass('is-danger')).toBe(true)
      expect(cancelButton.text()).toEqual('Back')
    })

    it('and calls cancelForm button on click', () => {
      const cancelFormMock = jest.fn()
      const wrapper = shallow(
        <PayeeForm {...props} activeWalletView={2} cancelForm={cancelFormMock} />,
      )

      const cancelButton = wrapper.find('.is-danger')
      cancelButton.simulate('click')

      expect(cancelFormMock).toHaveBeenCalled()
    })
  })
})
