import { DropdownForm } from '@containers/TransferCurrency/DropdownForm'
import { shallow } from 'enzyme'
import * as React from 'react'
import '../../../setupTests'

describe('DropdownForm', () => {
  let props

  beforeEach(() => {
    props = {
      onFieldChange: () => null,
      savedContacts: [
        {
          name: 'John',
          address: '123qwe',
        },
      ],
      payeePublicKey: 'qweasd',
      handleChange: { field: 'amount', newValue: '1' },
      accountList: [],
      activeAccount: {
        name: 'Account 1',
        keypair: {},
      },
    }
  })

  it('renders correctly', () => {
    const wrapper = shallow(<DropdownForm {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('switches to the new contact form on clicking the button', () => {
    const onFieldChangeMock = jest.fn()
    const wrapper = shallow(<DropdownForm {...props} onFieldChange={onFieldChangeMock} />)

    const button = wrapper.find('button')
    button.simulate('click')

    expect(onFieldChangeMock).toHaveBeenCalled()
  })
})
