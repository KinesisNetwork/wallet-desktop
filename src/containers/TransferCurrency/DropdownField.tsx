import { FormChangeHandler, Payee, TransferRequest } from '@types';
import * as React from 'react'

interface Props {
  onFieldChange: () => void
  savedContacts: Payee[]
  payeePublicKey: TransferRequest['payeePublicKey']
  handleChange: FormChangeHandler<TransferRequest>
}

export const DropdownFieldPresentation: React.SFC<Props> = (props) => {
  const contactNames = props.savedContacts
    .map(({ name, publicKey }) => <option key={publicKey} value={publicKey}>{name}</option>)

  const isSelected = props.savedContacts
    .findIndex(({ publicKey }) => props.payeePublicKey === publicKey) !== -1

  return (
    <React.Fragment>
      <label className="label is-small">To</label>
      <div className="field is-grouped">
        <div className="control is-expanded">
          <div className="select is-fullwidth payee-select">
            <select
              className={!isSelected ? 'has-text-grey' : ''}
              onChange={({ target: { value: newValue } }) => props.handleChange({ field: 'payeePublicKey', newValue })}
              value={props.payeePublicKey}
            >
              <option>Select a contact</option>
              {contactNames}
            </select>
          </div>
        </div>
        <div className="control is-flex">
          <span className="is-uppercase is-size-7 has-text-grey-lighter" style={{ alignSelf: 'center' }}>or</span>
        </div>
        <div className="control">
          <button
            className="button is-primary"
            onClick={props.onFieldChange}
          >Add new</button>
        </div>
      </div>
    </React.Fragment>

  )
}

export { DropdownFieldPresentation as DropdownField }
