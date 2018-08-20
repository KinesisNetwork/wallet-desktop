import { shallow } from 'enzyme';
import * as React from 'react'

import { InputField } from '@components/InputField'
import '../../setupTests'

describe('InputField', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <InputField
        id='connection-name'
        value=''
        onChangeHandler={() => null}
      />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should display a label if defined in props', () => {
    const wrapper = shallow(
      <InputField
        id='connection-name'
        value=''
        label='Connection Name'
        onChangeHandler={() => null}
      />
    )

    expect(wrapper.children()).toHaveLength(3)
    expect(wrapper.find('label')).toHaveLength(1)
    expect(wrapper.find('label').text()).toEqual('Connection Name')
  })

  it('displays input element with the optional props', () => {
    const wrapper = shallow(
      <InputField
        id='connection-name'
        value=''
        onChangeHandler={() => null}
        type='text'
        placeholder='Enter something'
      />
    )

    const input = wrapper.find('input')

    expect(input.prop('type')).toEqual('text')
    expect(input.prop('placeholder')).toEqual('Enter something')
  })

  it('renders an icon if defined in props', () => {
    const wrapper = shallow(
      <InputField
        id='connection-name'
        value=''
        onChangeHandler={() => null}
        icon='fa-plug'
      />
    )

    const icon = wrapper.find('i')

    expect(icon).toHaveLength(1)
    expect(icon.hasClass('fa-plug')).toBe(true)
  })

  it('renders a paragparh with help text if it is defined in props', () => {
    const wrapper = shallow(
      <InputField
        id='connection-name'
        value=''
        onChangeHandler={() => null}
        helpText='Help'
      />
    )

    const helpText = wrapper.find('.help')
    expect(helpText).toHaveLength(1)
    expect(helpText.text()).toEqual('Help')
  })

  it('calls the onChangeHandler method on values entered', () => {
    const onChangeHandlerMock = jest.fn()
    const wrapper = shallow(
      <InputField
        id='connection-name'
        value=''
        onChangeHandler={onChangeHandlerMock}
        helpText='Help'
      />
    )

    const input = wrapper.find('input')
    input.simulate('change', { target: { value: 'e' } })
    expect(onChangeHandlerMock).toHaveBeenCalledWith('e')
  })
})
