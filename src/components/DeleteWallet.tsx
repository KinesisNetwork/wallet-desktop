import * as React from 'react'

import { getPasswordConfirmation } from '@components/PasswordConfirmation'
import { Wallet } from '@types'

export interface Props {
  activeWallet: Wallet
  deleteWallet: (wallet: Wallet) => any
}

export class DeleteWallet extends React.Component<Props> {
  displayName = 'DeleteWallet'

  deleteWallet = async () => {
    const isSureToDelete = await sweetAlert({
      buttons: ['Go back', 'Delete Wallet'],
      dangerMode: true,
      icon: 'warning',
      text: 'Once deleted, you will not be able to recover this wallet.',
      title: 'Are you sure?',
    })
    if (!isSureToDelete) {
      return
    }
    const continueWithDelete = await getPasswordConfirmation(this.props.activeWallet)
    if (continueWithDelete) {
      this.props.deleteWallet(this.props.activeWallet)
    }
  }

  render() {
    return (
      <div className='buttons is-hidden-mobile'>
        <button type='submit' className='button is-danger' onClick={() => this.deleteWallet()}>
          <span className='icon'>
            <i className='fa fa-trash-alt fa-lg' />
          </span>
          <span>Delete Account from Wallet</span>
        </button>
      </div>
    )
  }
}
