import { TransferSummaryPresentation } from '@containers/TransferCurrency/TransferSummary'
import { shallow } from 'enzyme'
import * as React from 'react'
import '../../../setupTests'

describe('TransferSummary', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<TransferSummaryPresentation />)

    expect(wrapper).toMatchSnapshot()
  })
})
