import * as React from 'react'

interface TransferFromAccount {
  inititals?: string
  payeeName?: string
  icon?: string
  accountName?: string
}

export const AccountCard: React.SFC<TransferFromAccount> = (props: TransferFromAccount) => (
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
            <p className="has-text-grey-lighter">{props.payeeName || props.accountName}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)
