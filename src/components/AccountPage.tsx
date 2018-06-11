import { AccountPage } from '@types'
import * as React from 'react'

export interface Props {
  accountPage: AccountPage
  setAccountPage: (act: AccountPage) => any
}

export const AccountPageSelector: React.SFC<Props> = (props) => {
  const accountActionMembers = Object.keys(AccountPage).map((key) => AccountPage[key])
  const accountActionVals = accountActionMembers.filter((val) => typeof val !== 'number')
  const dropdownItems = accountActionVals.map((accountAction) => {
    return (
      <a
        key={accountAction}
        href='#'
        className={`dropdown-item ${props.accountPage === accountAction && 'is-active'}`}
        onClick={() => props.setAccountPage(accountAction)}
      >
        {accountAction}
      </a>
    )
  })

  return (
    <div className='dropdown is-active pull-right'>
      <div className='dropdown-trigger'>
        <button className='button' aria-haspopup='true' aria-controls='dropdown-menu'>
          <span>More</span>
          <span className='icon'>
            <i className='fa fa-key' aria-hidden='true' />
          </span>
        </button>
      </div>
      <div className='dropdown-menu' id='dropdown-menu' role='menu'>
        <div className='dropdown-content'>
          {dropdownItems}
        </div>
      </div>
    </div>
  )
}
