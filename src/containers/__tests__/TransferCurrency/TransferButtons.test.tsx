import { TransferButtons } from '@containers/TransferCurrency/TransferButtons'
import { shallow } from 'enzyme'
import * as React from 'react'
import '../../../setupTests'

describe('TransferButtons', () => {
  let props

  beforeEach(() => {
    props = {
      cancelText: 'Cancel',
      nextStepText: 'Next',
      cancelButtonClick: () => null,
      nextStepButtonClick: () => null,
    }
  })

  it('should render correctly', () => {
    const wrapper = shallow(<TransferButtons {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('calls the relevant methods on clicking the buttons', () => {
    const cancelButtonMock = jest.fn()
    const nextButtonMock = jest.fn()

    const wrapper = shallow(
      <TransferButtons
        {...props}
        cancelButtonClick={cancelButtonMock}
        nextStepButtonClick={nextButtonMock}
      />,
    )

    const cancelButton = wrapper.find('button').at(0)
    const nextButton = wrapper.find('button').at(1)
    cancelButton.simulate('click')
    nextButton.simulate('click')

    expect(cancelButtonMock).toHaveBeenCalled()
    expect(nextButtonMock).toHaveBeenCalled()
  })
})
