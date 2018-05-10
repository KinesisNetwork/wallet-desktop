import * as React from 'react'

import { TransactionOperation } from '@components'
import { TransactionOperationView } from '@types'

export interface Props {
  operations: TransactionOperationView[]
  loadNextTransactionPage: () => any
  isLastPage: boolean
}

export class Transactions extends React.Component<Props> {
  constructor(props) {
    super(props)
  }

  handleScroll = (ev: React.UIEvent<HTMLDivElement>) => {
    const element = ev.currentTarget
    const scrollableHeight = element.scrollHeight - element.clientHeight
    const shouldTriggerLoad = element.scrollTop >= 0.9 * scrollableHeight
    if (shouldTriggerLoad && !this.props.isLastPage) {
      this.props.loadNextTransactionPage()
    }
  }

  render() {
    return (
      <div className='scrollable' onScroll={this.handleScroll} style={{flexShrink: 10}}>
        {this.props.operations.map((t, i) => <TransactionOperation key={i} transactionWithOperation={t} />)}
      </div>
    )
  }
}
