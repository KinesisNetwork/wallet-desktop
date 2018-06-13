import { AccountPage } from '@types'
import * as React from 'react'

export interface Props {
  accountPage: AccountPage
  setAccountPage: (act: AccountPage) => any
}

export const AccountPageSelector: React.SFC<Props> = ({ accountPage, setAccountPage }) => {
  const isActive = (view: AccountPage): string => accountPage === view ? 'is-active' : ''
  return (
    <div className='buttons'>
      <button
        className={`button ${isActive(AccountPage.dashboard)}`}
        onClick={() => setAccountPage(AccountPage.dashboard)}
      >
        <span className='icon'><i className='fas fa-home' /></span>
      </button>
      <button
        className={`button ${isActive(AccountPage.sign)}`}
        onClick={() => setAccountPage(AccountPage.sign)}
      >
        <span className='icon'><i className='fas fa-edit' /></span>
      </button>
    </div>
  )
}
