import { shallow } from 'enzyme';
import * as React from 'react'

import { Transactions } from '@components/Transactions'
import '../../setupTests'

describe('Transactions', () => {
  let props

  beforeEach(() => {
    props = {
      isLastPage: false,
      isLoading: false,
      loadNextTransactionPage: () => null,
      operations: [
        {
          date: '',
          fee: '0.00046',
          operation: {},
          isIncoming: true,
          source: '123'
        },
        {
          date: '',
          fee: '0.02251',
          operation: {},
          isIncoming: false,
          source: '456'
        }
      ]
    }
  })

  describe('Transactions', () => {
    it('renders correctly', () => {
      const wrapper = shallow(<Transactions {...props} />)

      expect(wrapper).toMatchSnapshot()
    })

    it('renders a primary heading and two TransactionCard components', () => {
      const wrapper = shallow(<Transactions {...props} />)

      const heading = wrapper.find('h1')

      expect(heading).toHaveLength(1)
      expect(heading.text()).toEqual('Transactions')
      expect(wrapper.find('TransactionCard')).toHaveLength(2)
    })

    it('calls the handleScroll method on scroll', () => {
      const handleScrollMock = jest.fn()
      const wrapper = shallow(<Transactions {...props} loadNextTransactionPage={handleScrollMock} />)

      wrapper.find('.scrollable').simulate(
        'scroll',
        {
          currentTarget: {
            scrollHeight: 0,
            scrollTop: 1,
            clientHeight: 0
          }
        }
      )

      expect(handleScrollMock).toHaveBeenCalled()
    })
  })
})
