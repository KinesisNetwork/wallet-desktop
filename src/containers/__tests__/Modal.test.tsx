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
  })
})
