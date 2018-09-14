import { shallow } from 'enzyme'
import * as React from 'react'

import { ModalPresentation } from '@containers/Modal'
import '../../setupTests'

describe('Modal', () => {
  const props = {
    closeModal: () => null,
    completeOnBoarding: () => null,
    isModalActive: true,
    hasOnBoarded: false
  }

  it('should render correctly', () => {
    const wrapper = shallow(<ModalPresentation {...props} />)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.modal').hasClass('is-active')).toBe(true)
  })

  it('should not render modal if the onboarding has already been done', () => {
    const wrapper = shallow(<ModalPresentation {...props} hasOnBoarded={true} />)

    expect(wrapper.find('.modal').hasClass('is-active')).toBe(false)
  })

  it('calls closeModal and completeOnBoarding methods on clicking the button', () => {
    const closeModalStub = jest.fn()
    const completeOnBoardingStub = jest.fn()
    const wrapper = shallow(<ModalPresentation {...props} closeModal={closeModalStub} completeOnBoarding={completeOnBoardingStub} />)

    const button = wrapper.find('button')
    button.simulate('click')

    expect(closeModalStub).toHaveBeenCalled()
    expect(completeOnBoardingStub).toHaveBeenCalled()
  })
})
