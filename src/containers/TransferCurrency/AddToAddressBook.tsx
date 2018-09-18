import * as React from 'react'

import { InputField } from '@components/InputField';
import { cropPublicKey } from '@helpers/walletUtils'

interface AddressBook {
  recipientPublicKey: string
}

export const AddToAddressBook: React.SFC<AddressBook> = (props: AddressBook) => (
  <div className="box">
    <div className="level">
      <div className="level-left">
        <div className="level-item">
          <div className="image is-32x32 has-background-grey level-item" style={{ borderRadius: '100px' }}>
            <span className="has-text-grey-light"><i className="fal fa-user-circle" /></span>
          </div>
        </div>
        <div className="level-item">
          <p className="has-text-grey-lighter">{cropPublicKey(props.recipientPublicKey)}</p>
        </div>
      </div>
    </div>
    <div className="level">
      <div className="level-left">
        <div className="field">
          <input
            id="switchRoundedSuccess"
            type="checkbox"
            name="switchRoundedSuccess"
            className="switch is-rounded is-success"
            checked={true}
          />
          <label>Save to Address Book</label>
        </div>
      </div>
    </div>
    <div className="level">
      <InputField
        id='address-book-name'
        label='Name'
        onChangeHandler={() => null}
        value=''
        placeholder='Recipient name'
        icon='fa-user-circle'
      />
    </div>
  </div>
)
