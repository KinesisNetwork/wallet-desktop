import { Operation, TransactionOperation } from 'js-kinesis-sdk'
import { capitalize } from 'lodash'
import * as React from 'react'

export interface Props {
  operation: TransactionOperation
}

export const OperationView: React.SFC<Props> = ({operation}) => (
  <div className='message'>
    <div className='message-header'>
      <p>{ formatType(operation.type) }</p>
    </div>
    <div className='message-body'>
      <OperationSwitch operation={operation} />
    </div>
  </div>
)

// Splitting a camel cased string into splitted capitalised string
const formatType = (operationType: string): string => {
  const [start, ...others] = operationType.split(/([A-Z])/)
  return `${capitalize(start)} ${others.reduce((end, current, index) => index % 2 === 0 ? `${end} ${current}` : `${end}${current}`, '')}`
}

const OperationSwitch: React.SFC<Props> = ({operation}) => {
  switch (operation.type) {
    case 'payment':
      return <PaymentOperationView operation={operation} />
    case 'createAccount':
      return <CreateAccountOperationView operation={operation} />
    default:
      return <div className='box'><h2>No Operation Renderable</h2></div>
  }
}

const ReadOnlyField: React.SFC<{ title: string, text: string | number }> = ({title, text}) => (
  <div className='field is-horizontal'>
    <div className='field-label is-small'>
      <label className='label is-marginless'>{ title }</label>
    </div>
    <div className='field-body'>
      <div className='field'>
        <p className='control'>
          <input
            className='input is-static is-small'
            value={text}
            readOnly={true}
          />
        </p>
      </div>
    </div>
  </div>
)

const PaymentOperationView: React.SFC<{operation: Operation.Payment}> = ({operation}) => (
  <div>
    <ReadOnlyField title={'Destination'} text={operation.destination} />
    <ReadOnlyField title={'Asset'} text={operation.asset.code} />
    <ReadOnlyField title={'Amount'} text={operation.amount} />
  </div>
)

const CreateAccountOperationView: React.SFC<{operation: Operation.CreateAccount}> = ({operation}) => (
  <div>
    <ReadOnlyField title={'Destination'} text={operation.destination} />
    <ReadOnlyField title={'Starting Balance'} text={operation.startingBalance} />
    <ReadOnlyField title={'Source Account'} text={operation.source} />
  </div>

)
