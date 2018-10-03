import { Contact, FormChangeHandler, TransferRequest, WalletAccount } from '@types'
import * as React from 'react'

interface Props {
  onFieldChange: () => void
  savedContacts: Contact[]
  payeePublicKey: TransferRequest['targetPayee']
  handleChange: FormChangeHandler<TransferRequest>
  accountList: WalletAccount[]
  activeAccount: WalletAccount
}

export const DropdownFormPresentation: React.SFC<Props> = props => {
  const contactNames = props.savedContacts.map(({ name, address }) => (
    <option key={address} value={address}>
      {name}
    </option>
  ))

  const isOnContactList = props.savedContacts.find(
    ({ address }) => props.payeePublicKey === address,
  )

  const inactiveAccounts = props.accountList
    .filter(({ keypair }) => keypair.publicKey() !== props.activeAccount.keypair.publicKey())
    .map(({ name, keypair }) => (
      <option key={keypair.publicKey()} value={keypair.publicKey()}>
        {name}
      </option>
    ))

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
              {props.accountList.length > 1 && (
                <React.Fragment>
                  <option disabled={true}>
                    &#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;
                  </option>
                  {inactiveAccounts}
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
