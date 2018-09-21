import { shallow } from 'enzyme';
import * as React from 'react'

import { PayeeSelector } from '@components/PayeeSelector'
import '../../setupTests'

describe('PayeeSelector', () => {
  let props

  beforeEach(() => {
    props = {
      payees: [],
      payeePublicKey: '',
      handleChange: () => null,
      changeTransferView: () => null
    }
  })

  it('should render correctly', () => {
    const wrapper = shallow(<PayeeSelector {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  describe('if no payess exist', () => {
    it('renders a button', () => {
      const wrapper = shallow(<PayeeSelector {...props} />)

      const button = wrapper.find('a')

      expect(button.hasClass('button')).toBe(true)
      expect(button.children().find('.icon')).toHaveLength(1)
      expect(button.text()).toEqual('Add Payee')
    })

    it('calls changeTransferView on clicking the button', () => {
      const changeTransferViewMock = jest.fn()
      const wrapper = shallow(<PayeeSelector {...props} changeTransferView={changeTransferViewMock} />)

      const button = wrapper.find('a')
      button.simulate('click')

      expect(changeTransferViewMock).toHaveBeenCalledWith(1)
    })
  })

  describe('if payees exist', () => {
    let newPayee

    beforeEach(() => {
      newPayee = [
        {
          name: 'My account',
          publicKey: '123'
        }
      ]
    })

    it('returns a select dropdown and a button', () => {
      const wrapper = shallow(<PayeeSelector {...props} payees={newPayee} />)

      expect(wrapper.find('select')).toHaveLength(1)
      expect(wrapper.find('.button')).toHaveLength(1)
    })

    it('renders N + 2 option fields, where N = number of payees', () => {
      const wrapper = shallow(<PayeeSelector {...props} payees={newPayee} />)

      const option = wrapper.find('option')

      expect(option).toHaveLength(3)
      expect(option.at(0).text()).toEqual('Select a payee')
      expect(option.at(0).prop('hidden')).toEqual(true)
      expect(option.at(1).text()).toEqual('None')
      expect(option.at(2).text()).toEqual('My account')
      expect(option.at(2).prop('value')).toEqual('123')
    })

    it('greyes out select field if no payees are selected', () => {
      const wrapper = shallow(<PayeeSelector {...props} payees={newPayee} />)

      expect(wrapper.find('select').hasClass('has-text-grey')).toBe(true)
    })

    it('calls the handleChange method on changing option', () => {
      const handleChangeMock = jest.fn()
      const handleChangeMockParam = {
        field: 'payeePublicKey',
        newValue: '123'
      }
      const wrapper = shallow(<PayeeSelector {...props} payees={newPayee} handleChange={handleChangeMock} />)

      const select = wrapper.find('select')
      select.simulate('change', { target: { value: '123' } })

      expect(handleChangeMock).toHaveBeenCalledWith(handleChangeMockParam)
    })
  })
})
