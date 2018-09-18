import * as React from 'react'

import { cropPublicKey } from '@helpers/walletUtils'

interface AddressBook {
  addresseePublicKey: string
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
          <p className="has-text-grey-lighter">{cropPublicKey(props.addresseePublicKey)}</p>
        </div>
      </div>
    </div>
    <div className="level">
      <div className="level-left">
        <div className="level-item">Slider</div>
        <div className="level-item">Save to Address Book</div>
      </div>
    </div>
    <div>input element</div>
  </div>
)
