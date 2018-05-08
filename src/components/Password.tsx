import * as React from 'react'
import { Wallet } from '@types'

export interface Props {
  isAccountUnlocked: boolean
  activeWallet: Wallet
  password: string
  unlockWallet: (wallet: Wallet, password: string) => any
  setPasswordInput: (input: string) => any
  copyDecryptedPrivateKey: () => any
  lockWallet: (wallet: Wallet) => any
}

const LockedWallet: React.SFC<Props> = ({password, unlockWallet, activeWallet, setPasswordInput}) => (
  <div>
    <div className='field has-addons has-addons-centered'>
      <div className='control'>
        <input id='wallet-unlock-password'
          className='input' value={password}
          type='password' placeholder='Password'
          onChange={(e) => setPasswordInput(e.currentTarget.value)}
        />
      </div>
      <div className='control'>
        <button type='button' className='button' onClick={() => unlockWallet(activeWallet, password)}>
          <span className='icon'>
            <i className='fas fa-lock-open' />
          </span>
          <span>Unlock Wallet</span>
        </button>
      </div>
    </div>
  </div>
)

const UnlockedWallet: React.SFC<Props> = ({copyDecryptedPrivateKey, activeWallet, lockWallet}) => (
  <div>
    <div className='field is-grouped is-grouped-centered'>
      <div className='control'>
        <button type='button' className='button' onClick={() => copyDecryptedPrivateKey()} >
          <span className='icon'>
            <i className='fas fa-copy' />
          </span>
          <span>Copy Private Key</span>
        </button>
      </div>
      <div className='control'>
        <button type='submit' className='button'
          onClick={() => lockWallet(activeWallet)}
        >
          <span className='icon'>
            <i className='fas fa-lock' />
          </span>
          <span>Lock Wallet</span>
        </button>
      </div>
    </div>
  </div>
)

export const Password: React.SFC<Props> = (props) => (
  <React.Fragment>
    { props.isAccountUnlocked ? <UnlockedWallet {...props} /> : <LockedWallet {...props} /> }
  </React.Fragment>
)
