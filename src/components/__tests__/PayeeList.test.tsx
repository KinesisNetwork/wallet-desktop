import { shallow } from 'enzyme'
import * as React from 'react'

import { DeletePayeeLink, PayeeList } from '@components/PayeeList'
import '../../setupTests'

describe('PayeeList', () => {
  let props

  beforeEach(() => {
    props = {
      payees: [
        {
          name: 'Fred',
          publicKey: '123',
        },
        {
          name: 'Mark',
          publicKey: '456',
        },
      ],
      removePayee: () => null,
    }
  })

  it('renders correctly', () => {
    const wrapper = shallow(<PayeeList {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should display a primary heading and two LabelledField components', () => {
    const wrapper = shallow(<PayeeList {...props} />)

    const heading = wrapper.find('h1')
    const labelledField = wrapper.find('LabelledField')

    expect(heading).toHaveLength(1)
    expect(heading.text()).toEqual('MY PAYEES')
    expect(labelledField).toHaveLength(2)
  })

  it('passes props down to LabelledField', () => {
    const wrapper = shallow(<PayeeList {...props} />)

    const labelledField = wrapper.find('LabelledField')

    expect(labelledField.at(0).prop('label')).toEqual('Fred')
    expect(labelledField.at(0).prop('value')).toEqual('123')
    expect(labelledField.at(1).prop('label')).toEqual('Mark')
    expect(labelledField.at(1).prop('value')).toEqual('456')
  })
})

describe('DeletePayeeLink', () => {
  let props

  beforeEach(() => {
    props = {
      name: 'Fred',
      removePayee: () => null,
    }
  })

  it('renders correctly', () => {
    const wrapper = shallow(<DeletePayeeLink {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render a button with an icon', () => {
    const wrapper = shallow(<DeletePayeeLink {...props} />)

    const button = wrapper.find('button')

    expect(button).toHaveLength(1)
    expect(button.children().find('.icon')).toHaveLength(1)
  })

  it('calls removePayee method on click', () => {
    const removePayeeMock = jest.fn()
    const wrapper = shallow(<DeletePayeeLink {...props} removePayee={removePayeeMock} />)

    const button = wrapper.find('button')
    button.simulate('click')

    expect(removePayeeMock).toHaveBeenCalledWith('Fred')
  })
})
