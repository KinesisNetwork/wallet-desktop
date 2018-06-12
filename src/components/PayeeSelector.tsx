import * as React from 'react'

import { changeTransferView as action } from '@actions'
import { FormChangeHandler, Payee, TransferRequest, TransferView } from '@types'

export interface Props {
  targetPayee: TransferRequest['targetPayee']
  payees: Payee[]
  handleChange: FormChangeHandler<TransferRequest>
  changeTransferView: typeof action
}

export const PayeeSelector: React.SFC<Props> = ({ targetPayee, payees, handleChange, changeTransferView }) => {
  return (
    <div className='field'>
      <label className='label is-small'>Target Address</label>
      <div className='field is-grouped'>
        <div className='control is-expanded has-icons-left'>
          <div className='select is-fullwidth'>
            <select
              className={!targetPayee ? 'has-text-grey' : ''}
              onChange={({ target: { value: newValue } }) => handleChange({ field: 'targetPayee', newValue })}
              value={targetPayee}
            >
              <option value='' hidden={true}>Select a Payee</option>
              {payees.map(({ name, publicKey }) => <option key={publicKey} value={publicKey}>{name}</option>)}
            </select>
          </div>
          <div className={`icon is-small is-left ${targetPayee ? 'has-text-primary' : ''}`}>
            <i className='fas fa-user' />
          </div>
        </div>
        <div className='control'>
          <a className='button' onClick={() => changeTransferView(TransferView.addPayee)}>
            <span className='icon'>
              <i className='fa fa-plus' />
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}
