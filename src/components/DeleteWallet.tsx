import { getPasswordConfirmation } from '@components'
import { Wallet } from '@types'
import * as React from 'react'

export interface Props {
  activeWallet: Wallet
  deleteWallet: (wallet: Wallet) => any
}

export class DeleteWallet extends React.Component<Props> {
  deleteWallet = async () => {
    const isSureToDelete = await sweetAlert({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this wallet.',
      icon: 'warning',
      dangerMode: true,
      buttons: ['Go back', 'Delete Wallet'],
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
      <div className='buttons'>
        <button type='submit' className='button is-danger' onClick={() => this.deleteWallet()}>
          <span className='icon'>
            <i className='fa fa-trash-alt fa-lg' />
          </span>
          <span>Delete Wallet</span>
        </button>
      </div>
    )
  }
}
