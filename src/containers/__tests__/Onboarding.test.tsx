import { closeModal, completeOnBoarding } from '@actions'
import { shallow } from 'enzyme'
import * as React from 'react'

import { OnboardingPresentation } from '@containers/Onboarding'

describe('Modal', () => {
  const props = {
    closeModal,
    completeOnBoarding,
    isModalActive: true,
    hasOnBoarded: false,
  }

  it('should render correctly', () => {
    const wrapper = shallow(<OnboardingPresentation {...props} />)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.modal').hasClass('is-active')).toBe(true)
  })

  it('should not render modal if the onboarding has already been done', () => {
    const wrapper = shallow(<OnboardingPresentation {...props} hasOnBoarded={true} />)

    expect(wrapper.find('.modal').hasClass('is-active')).toBe(false)
  })

  it('calls closeModal and completeOnBoarding methods on clicking the button', () => {
    const closeModalStub = jest.fn()
    const completeOnBoardingStub = jest.fn()
    const wrapper = shallow(
      <OnboardingPresentation
        {...props}
        closeModal={closeModalStub}
        completeOnBoarding={completeOnBoardingStub}
      />,
    )

    const button = wrapper.find('button')
    button.simulate('click')

    expect(closeModalStub).toHaveBeenCalled()
    expect(completeOnBoardingStub).toHaveBeenCalled()
  })
})
