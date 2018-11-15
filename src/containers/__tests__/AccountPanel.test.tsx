import { shallow } from 'enzyme'
import { Keypair } from 'js-kinesis-sdk'
import * as React from 'react'

import { AccountPanelComponent } from '@containers/AccountPanel'
import '../../setupTests'

describe('AccountPanel', () => {
  const existingName = 'b'
  const props = {
    activeAccount: {
      name: existingName,
      keypair: Keypair.random(),
    },
    accountNames: ['a', 'b', 'c'],
  }

  it('calls updateAccountName after editing if input is valid', () => {
    const updateAccountName = jest.fn()
    const localProps = { ...props, updateAccountName }

    const wrapper = shallow(<AccountPanelComponent {...localProps} />)
    const instance = wrapper.instance() as AccountPanelComponent

    const input = 'ok'

    instance.handleChange({ target: { value: input } })
    instance.handleStopEditing()
    const { hasError, errorText } = instance.state

    expect(hasError).toBe(false)
    expect(errorText).toEqual('')
    expect(updateAccountName).toHaveBeenCalledWith({ existingName, newName: input })
  })

  it('shows error text if the account name already exists', () => {
    const updateAccountName = jest.fn()
    const localProps = { ...props, updateAccountName }

    const wrapper = shallow(<AccountPanelComponent {...localProps} />)
    const instance = wrapper.instance() as AccountPanelComponent

    const input = 'c'

    instance.handleChange({ target: { value: input } })
    instance.handleStopEditing()
    const { hasError, errorText } = instance.state

    expect(hasError).toBe(true)
    expect(errorText).toEqual(`Account with name "${input}" already exists`)
    expect(updateAccountName).not.toHaveBeenCalled()
  })

  it('shows error text if input exists without trailing spaces', () => {
    const updateAccountName = jest.fn()
    const localProps = { ...props, updateAccountName }

    const wrapper = shallow(<AccountPanelComponent {...localProps} />)
    const instance = wrapper.instance() as AccountPanelComponent

    const input = 'c  '

    instance.handleChange({ target: { value: input } })
    instance.handleStopEditing()
    const { hasError, errorText } = instance.state

    expect(hasError).toBe(true)
    expect(errorText).toEqual(`Account with name "${input.trim()}" already exists`)
    expect(updateAccountName).not.toHaveBeenCalled()
  })

  it('shows error text if the name is over 20 characters', () => {
    const updateAccountName = jest.fn()
    const localProps = { ...props, updateAccountName }

    const wrapper = shallow(<AccountPanelComponent {...localProps} />)
    const instance = wrapper.instance() as AccountPanelComponent

    const input = 'itsovertwentycharacters'

    instance.handleChange({ target: { value: input } })
    const { hasError, errorText } = instance.state
    instance.handleStopEditing()

    expect(hasError).toBe(true)
    expect(errorText).toEqual('Account name must be between 1 and 20 characters in length')
    expect(updateAccountName).not.toHaveBeenCalled()
  })

  it('shows error text if the name (without spaces) is blank', () => {
    const updateAccountName = jest.fn()
    const localProps = { ...props, updateAccountName }

    const wrapper = shallow(<AccountPanelComponent {...localProps} />)
    const instance = wrapper.instance() as AccountPanelComponent

    const input = ''

    instance.handleChange({ target: { value: input } })
    const { hasError, errorText } = instance.state
    instance.handleStopEditing()

    expect(hasError).toBe(true)
    expect(errorText).toEqual('Account name must be between 1 and 20 characters in length')
    expect(updateAccountName).not.toHaveBeenCalled()
  })

  it("nothing happens if the name doesn't change or only spaces are added to end of name", () => {
    const updateAccountName = jest.fn()
    const localProps = { ...props, updateAccountName }

    const wrapper = shallow(<AccountPanelComponent {...localProps} />)
    const instance = wrapper.instance() as AccountPanelComponent

    instance.handleChange({ target: { value: existingName } })
    instance.handleStopEditing()
    instance.handleChange({ target: { value: `${existingName} ` } })
    instance.handleStopEditing()

    expect(updateAccountName).not.toHaveBeenCalled()
  })
})
