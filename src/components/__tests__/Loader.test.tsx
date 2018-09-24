import { shallow } from 'enzyme'
import * as React from 'react'

import { Loader } from '@components/Loader'
import '../../setupTests'

describe('Loader', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Loader />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders four cubes', () => {
    const wrapper = shallow(<Loader />)

    expect(wrapper.hasClass('sk-folding-cube')).toBe(true)
    expect(wrapper.children()).toHaveLength(4)
  })
})
