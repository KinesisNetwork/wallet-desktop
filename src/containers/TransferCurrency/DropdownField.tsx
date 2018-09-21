import { Payee } from '@types';
import * as React from 'react'

interface Props {
  onFieldChange: () => void
  savedContacts: Payee[]
}

export const DropdownFieldPresentation: React.SFC<Props> = (props) => {
  const contactNames = props.savedContacts.map(({ name }) => <option key={name}>{name}</option>)

  return (
    <React.Fragment>
      <label className="label is-small">To</label>
      <div className="field is-grouped">
        <div className="control is-expanded">
          <div className="select is-fullwidth payee-select">
            <select className="has-text-grey">
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
