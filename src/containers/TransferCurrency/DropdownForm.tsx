import * as React from 'react'

import { DropdownDivider } from '@containers/Sidebar/DropdownDivider'
import { getInactiveAccounts } from '@services/accounts'
import { Contact, FormChangeHandler, TransferRequest, WalletAccount } from '@types'

interface Props {
  onFieldChange: () => void
  savedContacts: Contact[]
  payeePublicKey: TransferRequest['targetPayee']
  handleChange: FormChangeHandler<TransferRequest>
  accounts: WalletAccount[]
  activeAccount: WalletAccount
}

export const DropdownFormPresentation: React.SFC<Props> = props => {
  const contactNames = props.savedContacts.map(({ name, address }) => (
    <option key={address} value={address}>
      {name}
    </option>
  ))

  const inactiveAccounts = getInactiveAccounts(props.accounts, props.activeAccount)
  const inactiveAccountOptions = inactiveAccounts.map(({ name, address }) => (
    <option key={address} value={address}>
      {name}
    </option>
  ))

  const isOnContactList = props.savedContacts
    .concat(inactiveAccounts)
    .find(({ address }) => props.payeePublicKey === address)

  return (
    <React.Fragment>
      <label className="label is-small">To</label>
      <div className="field is-grouped">
        <div className="control is-expanded">
          <div className="select is-fullwidth payee-select">
            <select
              className={!isOnContactList ? 'has-text-grey' : ''}
              onChange={({ target: { value: newValue } }) =>
                props.handleChange({ field: 'targetPayee', newValue })
              }
              value={props.payeePublicKey}
            >
              <option>Select a contact</option>
              {contactNames}
              {props.accounts.length > 1 && (
                <React.Fragment>
                  <option disabled={true}>
                    <DropdownDivider />
                  </option>
                  {inactiveAccountOptions}
                </React.Fragment>
              )}
            </select>
          </div>
        </div>
        <div className="control is-flex">
          <span
            className="is-uppercase is-size-7 has-text-grey-lighter"
            style={{ alignSelf: 'center' }}
          >
            or
          </span>
        </div>
        <div className="control">
          <button className="button is-primary" onClick={props.onFieldChange}>
            Add new
          </button>
        </div>
      </div>
    </React.Fragment>
  )
}

export { DropdownFormPresentation as DropdownForm }
