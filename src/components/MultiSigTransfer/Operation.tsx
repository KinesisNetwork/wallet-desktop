import * as React from 'react'
import { Operation, TransactionOperation, } from 'stellar-sdk'

export interface IProps {
  operation: TransactionOperation
}

export const OperationView: React.SFC<IProps> = ({operation}) => {
  return (
    <div className='message'>
      <div className='message-header'>
        <h3 className='subtitle'>{ operation.type }</h3>
      </div>
      <div className='message-body'>
        <OperationSwitch operation={operation} />
      </div>
    </div>
  )
}

const OperationSwitch: React.SFC<IProps> = ({operation}) => {

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
    <div className='field-label is-normal'>
      <label className='label' style={{margin: 0}}>{ title }</label>
    </div>
    <div className='field-body'>
      <div className='field'>
        <p className='control'>
          <input
            className='input is-static'
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
