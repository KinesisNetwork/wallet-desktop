import { AddressView } from '@components/AddressView'
import { AddressDisplay } from '@types'
import * as React from 'react'

interface TransferFromAccount {
  inititals?: string
  icon?: string
  address: string
  addressDisplay: AddressDisplay
}

export const AccountCard: React.SFC<TransferFromAccount> = (props: TransferFromAccount) => {
  return (
    <div className="column">
      <div className="box">
        <div className="level">
          <div className="level-left">
            <div className="image is-32x32 has-background-grey level-item" style={{ borderRadius: '100px' }}>
              <span className="has-text-grey-light">{props.inititals ||
                (props.icon && <i className={`fal ${props.icon}`} />)
              }</span>
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
