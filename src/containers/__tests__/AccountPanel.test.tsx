import { AccountPanelComponent } from '@containers/AccountPanel'
import { NotificationType } from '@types'
import { shallow } from 'enzyme'
import { Keypair } from 'js-kinesis-sdk'
import * as React from 'react'

describe.only('AccountPanel', () => {
  const props = {
    activeAccount: {
      name: 'b',
      keypair: Keypair.random(),
    },
    accountNames: ['a', 'b', 'c'],
  }

  it('throws an error action if the name already exists on another account', () => {
    const showNotification = jest.fn()
    const updateAccountName = jest.fn()
    const localProps = { ...props, showNotification, updateAccountName }

    const wrapper = shallow(<AccountPanelComponent {...localProps} />)
    const instance = wrapper.instance() as AccountPanelComponent

    instance.onChange({ target: { value: 'c' } })
    instance.onStopEditing()

    expect(showNotification).toHaveBeenCalled()
    expect(updateAccountName).not.toHaveBeenCalled()
    expect(showNotification).toBeCalledWith({
      message: 'Account name must be unique',
      type: NotificationType.error,
    })
  })

  it('nothing is dispatched if the name isnt changed', () => {
    const showNotification = jest.fn()
    const updateAccountName = jest.fn()
    const localProps = { ...props, showNotification, updateAccountName }

    const wrapper = shallow(<AccountPanelComponent {...localProps} />)
    const instance = wrapper.instance() as AccountPanelComponent

    instance.onChange({ target: { value: 'b' } })
    instance.onStopEditing()

    expect(showNotification).not.toHaveBeenCalled()
    expect(updateAccountName).not.toHaveBeenCalled()
  })

  it('dispatches a success banner when the account name is updated correctly', () => {
    const showNotification = jest.fn()
    const updateAccountName = jest.fn()
    const localProps = { ...props, showNotification, updateAccountName }

    const wrapper = shallow(<AccountPanelComponent {...localProps} />)
    const instance = wrapper.instance() as AccountPanelComponent

    instance.onChange({ target: { value: 'd' } })
    instance.onStopEditing()

    expect(showNotification).toHaveBeenCalled()
    expect(updateAccountName).toHaveBeenCalled()
    expect(showNotification).toBeCalledWith({
      message: 'Account name successfully updated',
      type: NotificationType.success,
    })
  })
})
