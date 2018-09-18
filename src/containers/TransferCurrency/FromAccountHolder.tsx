import * as React from 'react'

import { getInitials } from '@helpers/walletUtils'

interface TransferFromAccount {
  walletName: string
}

export const FromAccountHolder: React.SFC<TransferFromAccount> = (props: TransferFromAccount) => (
  <div className="columns is-vcentered">
    <div className="column">
      <div className="box">
        <div className="level">
          <div className="level-left">
            <div className="image is-32x32 has-background-grey level-item" style={{ borderRadius: '100px' }}>
              <span className="has-text-grey-light">{getInitials(props.walletName)}</span>
            </div>
            <div className="level-item">
              <p className="has-text-grey-lighter">Accountname</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="column is-narrow">
      <div className="level">
        <div className="level-item">
          <span className="has-text-grey-lighter is-size-2">
            <i className="fal fa-arrow-circle-right" />
          </span>
        </div>
      </div>
    </div>
  </div>
)
