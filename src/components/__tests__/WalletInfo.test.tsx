import { shallow } from 'enzyme'
import * as React from 'react'

import { LabelledField } from '@components/LabelledField'
import { WalletInfo } from '@components/WalletInfo'

describe('WalletInfo', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <WalletInfo publicKey="" accountBalance={0} accountName="" isAccountLoading={true} />,
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should have a primary heading', () => {
    const wrapper = shallow(
      <WalletInfo publicKey="" accountBalance={0} accountName="" isAccountLoading={true} />,
    )

    const heading = wrapper.find('h1')

    expect(heading.text()).toEqual('Account Information')
  })

  it('renders three LabelledField components', () => {
    const wrapper = shallow(
      <WalletInfo publicKey="" accountBalance={0} accountName="" isAccountLoading={true} />,
    )

    expect(wrapper.find(LabelledField)).toHaveLength(3)
  })
})
