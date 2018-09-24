import { shallow } from 'enzyme'
import * as React from 'react'

import { Transfer } from '@components/Transfer'
import { TransferView } from '@types'

describe('Transfer', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Transfer transferView={TransferView.transfer} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders a primary heading', () => {
    const wrapper = shallow(<Transfer transferView={TransferView.transfer} />)

    const heading = wrapper.find('h1')

    expect(
      heading
        .find('span')
        .at(0)
        .text(),
    ).toEqual('Transfer')
    expect(
      heading
        .find('span')
        .at(1)
        .text(),
    ).toEqual('KAU')
  })

  it('displays a TransferForm if transfer view indicates', () => {
    const wrapper = shallow(<Transfer transferView={TransferView.transfer} />)

    expect(wrapper.find('Connect(TransferForm)')).toHaveLength(1)
  })
})
