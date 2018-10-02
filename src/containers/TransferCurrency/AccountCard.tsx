import { AddressView } from '@components/AddressView'
import { InitialsAvatar } from '@components/InitialsAvatar'
import { AddressDisplay, ImageSize } from '@types'
import * as React from 'react'

interface TransferFromAccount {
  name: string
  address: string
  addressDisplay: AddressDisplay
}

export const AccountCard: React.SFC<TransferFromAccount> = (props: TransferFromAccount) => {
  return (
    <div className="column">
      <div className="box">
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <InitialsAvatar name={props.name} size={ImageSize.small} />
            </div>
            <div className="level-item">
              <p className="has-text-grey-lighter">
                <AddressView address={props.address} addressDisplay={props.addressDisplay} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
