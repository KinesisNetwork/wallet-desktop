import { mount, shallow } from 'enzyme';
import * as React from 'react'

import { ConnectionForm } from '@components/ConnectionForm'
import { InputField } from '@components/InputField'
import '../../setupTests'

describe('ConnectionForm', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <ConnectionForm
        addConnection={() => null}
        handleConnectionFormChange={() => null}
        horizonURL=''
        name=''
        networkPassphrase=''
      />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('renders a heading section', () => {
    const wrapper = shallow(
      <ConnectionForm
        addConnection={() => null}
        handleConnectionFormChange={() => null}
        horizonURL=''
        name=''
        networkPassphrase=''
      />
    )

    expect(wrapper.find('h1').text()).toEqual('Add New Connection')
    expect(wrapper.find('.icon').children()).toHaveLength(1)
    expect(wrapper.find('.icon').children().hasClass('fa-plug')).toBe(true)
  })

  it('should render a form with three InputFields and a button', () => {
    const wrapper = shallow(
      <ConnectionForm
        addConnection={() => null}
        handleConnectionFormChange={() => null}
        horizonURL=''
        name=''
        networkPassphrase=''
      />
    )

    const form = wrapper.find('form')

    expect(form.exists()).toBe(true)
    expect(form.children()).toHaveLength(4)
    expect(form.prop('onSubmit')).toHaveLength(1)
    expect(form.childAt(3).find('button').text()).toEqual('Add Connection')

    const inputField = form.find(InputField)
    expect(inputField).toHaveLength(3)
  })

  it('calls handleSubmit function on submit', () => {
    const mockHandleSubmit = jest.fn()
    const wrapper = shallow(
      <ConnectionForm
        addConnection={mockHandleSubmit}
        handleConnectionFormChange={() => null}
        horizonURL='asd'
        name='zxc'
        networkPassphrase='qwe'
      />
    )

    const button = wrapper.find('form')
    button.simulate('submit', { preventDefault: () => null })
    expect(mockHandleSubmit).toHaveBeenCalled()
  })
})
