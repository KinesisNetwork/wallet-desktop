import * as React from 'react'

import { changeTransferView as action } from '@actions'
import { Contact, FormChangeHandler, TransferRequest, TransferView } from '@types'

export interface Props {
  targetPayee: TransferRequest['targetPayee']
  payees: Contact[]
  handleChange: FormChangeHandler<TransferRequest>
  changeTransferView: typeof action
}

export const PayeeSelector: React.SFC<Props> = ({
  targetPayee,
  payees,
  handleChange,
  changeTransferView,
}) => {
  const isSelected = payees.findIndex(({ address }) => targetPayee === address) !== -1
  const selector =
    payees.length === 0 ? (
      <div className="control is-expanded">
        <a
          className="button is-fullwidth"
          onClick={() => changeTransferView(TransferView.addPayee)}
        >
          <span className="icon">
            <i className="fa fa-plus" />
          </span>
          <span>Add Payee</span>
        </a>
      </div>
    ) : (
      <React.Fragment>
        <div className="control is-expanded has-icons-left">
          <div className="select is-fullwidth">
            <select
              className={!isSelected ? 'has-text-grey' : ''}
              onChange={({ target: { value: newValue } }) =>
                handleChange({ field: 'targetPayee', newValue })
              }
              value={targetPayee}
            >
              <option value="" hidden={true}>
                Select a payee
              </option>
              <option value="">None</option>
              {payees.map(({ name, address }) => (
                <option key={address} value={address}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className={`icon is-small is-left ${isSelected ? 'has-text-primary' : ''}`}>
            <i className="fas fa-user" />
          </div>
        </div>
        <div className="control">
          <a className="button" onClick={() => changeTransferView(TransferView.addPayee)}>
            <span className="icon">
              <i className="fa fa-plus" />
            </span>
          </a>
        </div>
      </React.Fragment>
    )
  return (
    <div className="field">
      <div className="field is-grouped">{selector}</div>
    </div>
  )
}

PayeeSelector.displayName = 'PayeeSelector'
