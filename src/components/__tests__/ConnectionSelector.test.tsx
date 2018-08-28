import { shallow } from 'enzyme';
import * as React from 'react'

import { ConnectionSelector } from '@components/ConnectionSelector'
import '../../setupTests'

describe('ConnectionSelector', () => {
  let props

  beforeEach(() => {
    props = {
      connections:
        [
          {
            name: 'Kinesis KAU Testnet',
            networkPassphrase: 'qwe',
            horizonURL: 'https://asd.io'
          }
        ],
      activeConnection: 0,
      selectConnection: () => null
    }
  })

  it('renders correctly', () => {
    const wrapper = shallow(<ConnectionSelector {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders a primary heading and an icon', () => {
    const wrapper = shallow(<ConnectionSelector {...props} />)

    expect(wrapper.find('h1')).toHaveLength(1)
    expect(wrapper.find('h1').text()).toEqual('Select a Network')
    expect(wrapper.find('.icon')).toHaveLength(1)
    expect(wrapper.find('.icon').children().hasClass('fa-wifi')).toBe(true)
  })

  it('should two ConnectionButton components if two connections are fed', () => {
    const newConnections = [
      {
        name: 'Kinesis KAU Testnet',
        networkPassphrase: 'qwe',
        horizonURL: 'https://asd.io'
      },
      {
        name: 'Kinesis KAG Testnet',
        networkPassphrase: 'rtr',
        horizonURL: 'https://zxc.io'
      }
    ]
    const wrapper = shallow(<ConnectionSelector {...props} connections={newConnections} />)

    expect(wrapper.children()).toHaveLength(3)
    expect(wrapper.find('ConnectionButton')).toHaveLength(2)
  })
})
