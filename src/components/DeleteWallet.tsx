import * as React from 'react'
import { Wallet } from '@types';

export interface Props {
  activeWallet: Wallet
  deleteWallet: (wallet: Wallet) => any
}

export const DeleteWallet: React.SFC<Props> = ({ deleteWallet, activeWallet }) => (
  <div className='buttons'>
    <button type='submit' className='button is-danger' onClick={() => deleteWallet(activeWallet)}>
      <span className='icon'>
        <i className='fa fa-trash-alt fa-lg' />
      </span>
      <span>Delete Wallet</span>
    </button>
  </div>
)
