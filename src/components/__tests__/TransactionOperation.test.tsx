import { shallow } from 'enzyme';
import { startCase } from 'lodash'
import * as React from 'react'

import { TransactionCard } from '@components/TransactionOperation'
import '../../setupTests'

describe('TransactionCard', () => {
  let props

  beforeEach(() => {
    props = {
      transactionWithOperation: {
        date: '',
        fee: '0.00046',
        isIncoming: true,
        operation: {
          account: 'qwer',
          created_at: '2018-08-23T03:41:54Z',
          funder: 'asdf',
          id: '1234',
          source_account: 'zxcv',
          starting_balance: '0.1',
          transaction_hash: '785d',
          succeeds: () => null,
          type: 'create_account'
        }
      }
    }
  })

  it('renders correctly', () => {
    const wrapper = shallow(<TransactionCard {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('displays an up arrow icon and a header matching operation type', () => {
    const wrapper = shallow(<TransactionCard {...props} />)

    const messageHeader = wrapper.find('.message-header')

    expect(messageHeader).toHaveLength(1)
    expect(messageHeader.find('i').hasClass('fa-arrow-up')).toBe(true)
    expect(messageHeader.text()).toBe('Create Account')
  })

  it('renders eight HorizontalLabelledField components as renderOperationRecords filters operations', () => {
    const wrapper = shallow(<TransactionCard {...props} />)

    const horizontalLabelledField = wrapper.find('HorizontalLabelledField')

    expect(horizontalLabelledField).toHaveLength(8)

    const labels = horizontalLabelledField.map((node) => node.prop('label'))

    expect(labels.includes(startCase('succeeds'))).toBe(false)
    expect(labels.includes(startCase('id'))).toBe(false)
    expect(labels.includes(startCase('type'))).toBe(false)
    expect(labels.includes(startCase('funder'))).toBe(true)
  })
})
