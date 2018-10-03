import { NewContactTransferPresentation } from '@containers/TransferCurrency/NewContactTransfer'
import { shallow } from 'enzyme'
import * as React from 'react'
import '../../../setupTests'

describe('NewContactTransfer', () => {
  let props

  beforeEach(() => {
    props = {
      onFieldChange: () => null,
      handleChange: () => null,
      errors: {
        targetPayee: 'error',
      },
      onSaveToContactsChange: () => null,
      saveToContacts: true,
      name: 'John',
      publicKey: '123qwe',
    }
  })

  it('should render correctly', () => {
    const wrapper = shallow(<NewContactTransferPresentation {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('switches to the dropdown form on clicking the button', () => {
    const onFieldChangeMock = jest.fn()
    const wrapper = shallow(
      <NewContactTransferPresentation {...props} onFieldChange={onFieldChangeMock} />,
    )

    const button = wrapper.find('button')
    button.simulate('click')

    expect(onFieldChangeMock).toHaveBeenCalled()
  })

  it('calls the onSaveToContactsChange method on changing the state of the switch', () => {
    const onSaveToContactsChangeMock = jest.fn()
    const wrapper = shallow(
      <NewContactTransferPresentation
        {...props}
        onSaveToContactsChange={onSaveToContactsChangeMock}
      />,
    )

    const switchButton = wrapper.find('.switch')
    switchButton.simulate('change')

    expect(onSaveToContactsChangeMock).toHaveBeenCalled()
  })
})
