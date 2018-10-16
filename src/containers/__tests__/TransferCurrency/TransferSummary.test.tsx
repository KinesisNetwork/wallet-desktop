import { shallow } from 'enzyme'
import * as React from 'react'

import { TransferSummaryPresentation } from '@containers/TransferCurrency/TransferSummary'
import { Currency } from '@types'
import '../../../setupTests'

describe('TransferSummary', () => {
  const props = {
    amount: '5',
    currency: Currency.KAU,
    fee: '1',
    memo: 'memo',
  }
  it('should render correctly', () => {
    const wrapper = shallow(<TransferSummaryPresentation {...props} />)

    expect(wrapper).toMatchSnapshot()
  })
})
